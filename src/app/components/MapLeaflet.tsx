"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Konfigurasi ikon leaflet
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
  status: "Online" | "Offline"; // dari helm_status
  incident: boolean;
}

interface LocationWithId extends Location {
  id: string;
}

export default function MapLeaflet() {
  const [locations, setLocations] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://192.168.1.106:3001/api/update-location");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Gagal fetch lokasi:", err);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fungsi konversi helm_status dari Arduino ke Online/Offline
  const getStatus = (helm_status: string): "Online" | "Offline" =>
    helm_status === "On" ? "Online" : "Offline";

  // Ambil H01 dari Arduino
  const h01: LocationWithId = locations["H01"]
    ? {
        id: "H01",
        lat: locations["H01"].lat,
        lng: locations["H01"].lng,
        updatedAt: locations["H01"].updatedAt,
        status: getStatus(locations["H01"].helm_status),
        incident: locations["H01"].incident,
      }
    : {
        id: "H01",
        lat: -7.0258667,
        lng: 112.4788683,
        updatedAt: Date.now(),
        status: "Offline",
        incident: false,
      };

  // Dummy locations tetap ada
  const dummyLocations: LocationWithId[] = [
    {
      id: "Ayah",
      lat: -7.981,
      lng: 112.630,
      updatedAt: Date.now(),
      status: "Online",
      incident: false,
    },
    {
      id: "Ibu",
      lat: -7.250,
      lng: 112.768,
      updatedAt: Date.now(),
      status: "Offline",
      incident: false,
    },
    {
      id: "Anak 1",
      lat: -7.472,
      lng: 112.445,
      updatedAt: Date.now(),
      status: "Online",
      incident: false,
    },
    {
      id: "Anak 2",
      lat: -7.555,
      lng: 112.020,
      updatedAt: Date.now(),
      status: "Offline",
      incident: false,
    },
  ];

  // Gabungkan semua locations
  const locationsArray: LocationWithId[] = [h01, ...dummyLocations];

  // Center map H01
  const center: [number, number] = [h01.lat, h01.lng];

  // Incident alert
  const incidentAlerts = locationsArray.filter((loc) => loc.incident);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md w-full p-4 sm:p-6">
      <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden mb-4">
        <MapContainer center={center} zoom={8} className="w-full h-full rounded-xl relative z-0">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {locationsArray.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="text-sm">
                  <b>{loc.id}</b> <br />
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

      {/* Notifikasi incident */}
      {incidentAlerts.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {incidentAlerts.map((loc) => (
            <div key={loc.id}>
              ⚠️ Incident detected at <b>{loc.id}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
