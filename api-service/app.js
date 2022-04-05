const cors = require("cors");
const express = require("express");
const app = express();
const port = 4000;
const { sequelize } = require("./models/index");
const { QueryTypes } = require("sequelize");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/data", async (req, res) => {
  try {
    const query = `
    SELECT 
      "d"."longitude",
      "d"."latitude",
      "d"."brand",
      '2021-10-20 07:00:00 to 2021-10-20 08:00:00' AS "range",
      sum("d"."user_count") AS "user_per_brand",
      (
        SELECT sum("d2"."user_count")
        FROM "Data" AS "d2"
        WHERE "d"."longitude" = "d2"."longitude"
        GROUP BY "d2"."latitude", "d2"."longitude"
      ) AS "total_user"
    
    FROM "Data" AS "d"
    
    WHERE "d"."time" BETWEEN '2021-10-20 07:00:00.000 +0700' AND '2021-10-20 08:00:00.000 +0700'
    
    GROUP BY "d"."brand", "d"."latitude", "d"."longitude"
    
    ORDER BY "d"."longitude"`;
    const data = await sequelize.query(query, { type: QueryTypes.SELECT });

    let result = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {};
      if (i === 0 || data[i].longitude !== data[i - 1].longitude) {
        obj.longitude = +data[i].longitude;
        obj.latitude = +data[i].latitude;
        obj.range = data[i].range;
        obj.total_user = +data[i].total_user;
        obj.detail = [{ brand: data[i].brand, user_per_brand: +data[i].user_per_brand }];
        result.push(obj);
      }
      if (i !== 0 && data[i].longitude === data[i - 1].longitude) {
        result[result.length - 1].detail.push({ brand: data[i].brand, user_per_brand: +data[i].user_per_brand });
      }
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.name });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
