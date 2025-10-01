"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Location {
  lat: number;
  lng: number;
  updatedAt: number;
  status: "Online" | "Offline";
  incident: boolean;
}

interface LocationWithId extends Location {
  id: string;
}

export default function MapLeaflet() {
  const [locations, setLocations] = useState<Record<string, Location>>({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://192.168.1.106:3001/api/update-location");
        const data: Record<string, Location> = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Gagal fetch lokasi:", err);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 1000);
    return () => clearInterval(interval);
  }, []);

  const locationsArray: LocationWithId[] = Object.entries(locations).map(
    ([id, loc]) => ({ id, ...loc })
  );

  const center: [number, number] =
    locationsArray.length > 0
      ? [locationsArray[0].lat, locationsArray[0].lng]
      : [-7.250445, 112.768845]; // default Surabaya

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md w-full h-[400px] md:h-[600px] p-4 sm:p-6">
      <div className="w-full h-full rounded-xl overflow-hidden">
        <MapContainer
          center={center}
          zoom={7}
          className="w-full h-full rounded-xl relative z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {locationsArray.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="text-sm">
                  <b>Helm {loc.id}</b> <br />
                  Updated: {new Date(loc.updatedAt).toLocaleTimeString()} <br />
                  Status:{" "}
                  <span
                    className={
                      loc.status === "Online"
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {loc.status}
                  </span>
                  <br />
                  {loc.incident && (
                    <span className="text-orange-500 font-bold">
                      ⚠️ Incident Detected!
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
