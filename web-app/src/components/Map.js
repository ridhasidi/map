import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
export default function MapComponent() {
  const [data, setData] = useState([]);
  const baseUrl = "http://localhost:4000/data";
  const fetchData = async () => {
    try {
      const { data } = await axios({
        method: "GET",
        url: baseUrl,
      });
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (data.length === 0) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  } else if (data.length > 0) {
    return (
      <div>
        <MapContainer style={{ height: "90vh", width: "100%" }} center={[data[1]?.latitude, data[1].longitude]} zoom={17}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {data.map((e, index) => {
            return (
              <Marker key={index} position={[e.latitude, e.longitude]}>
                <Popup>
                  <div>
                    <div>
                      <h6 className="text-center fw-bolder m-0 pb-1">Information</h6>
                    </div>

                    <p className="text-center m-0">
                      {e.range} <span style={{ fontWeight: "bold" }}>({e.total_user})</span>
                    </p>
                    <table className="table ">
                      <thead>
                        <tr>
                          <th className="text-center">Name</th>
                          <th className="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {e.detail.map((el, i) => {
                          return (
                            <tr key={i}>
                              <td className="text-center">{el.brand}</td>
                              <td className="text-center">{el.user_per_brand}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    );
  }
}
