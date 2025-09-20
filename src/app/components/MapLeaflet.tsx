"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icon
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
}

interface LocationWithId extends Location {
  id: string;
}

export default function MapLeaflet() {
  const [locations, setLocations] = useState<Record<string, Location>>({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://192.168.1.106:3000/api/update-location"); // ganti IP PC/server
        const data: Record<string, Location> = await res.json();
        console.log("Data fetch lokasi:", data);
        setLocations(data);
      } catch (err) {
        console.error("Gagal fetch lokasi:", err);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 3000);
    return () => clearInterval(interval);
  }, []);

  const locationsArray: LocationWithId[] = Object.entries(locations).map(
    ([id, loc]) => ({ id, ...loc })
  );

  // Center mengikuti marker pertama (atau default jika kosong)
  const center: [number, number] =
    locationsArray.length > 0
      ? [locationsArray[0].lat, locationsArray[0].lng]
      : [-7.250445, 112.768845];

  return (
     <MapContainer
      center={[-7.250445, 112.768845]}
      zoom={7}                        
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {locationsArray.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            Helm {loc.id} <br />
            Updated: {new Date(loc.updatedAt).toLocaleTimeString()} <br />
            Status: {Date.now() - loc.updatedAt < 10000 ? "Online" : "Offline"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
