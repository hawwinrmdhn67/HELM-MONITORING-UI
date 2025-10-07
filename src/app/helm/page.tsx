"use client";

import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LocationWithId {
  id: string;
  lat: number;
  lng: number;
  updatedAt: number;
}

export default function HelmPage() {
  const [locations, setLocations] = useState<LocationWithId[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/update-location");
        const data = await res.json();

        const arr: LocationWithId[] = Object.entries(data).map(
          ([id, loc]: [string, any]) => ({
            id,
            lat: loc.lat,
            lng: loc.lng,
            updatedAt: loc.updatedAt,
          })
        );

        const now = Date.now();
        const dummyLocations: LocationWithId[] = [
          { id: "Ayah", lat: -7.981, lng: 112.630, updatedAt: now },
          { id: "Ibu", lat: -7.250, lng: 112.768, updatedAt: now - 10000 },
          { id: "Anak 1", lat: -7.472, lng: 112.445, updatedAt: now },
          { id: "Anak 2", lat: -7.555, lng: 112.020, updatedAt: now - 10000 },
        ];

        setLocations([...arr, ...dummyLocations]);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusBadge = (online: boolean) =>
    online
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300";

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-gray-800"
        >
          Helm User
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-md space-y-4"
        >
          {locations.length === 0 ? (
            <p className="text-gray-500">Belum ada helm terhubung...</p>
          ) : (
            locations.map((loc) => (
              <div
                key={loc.id}
                className="flex justify-between items-start md:items-center p-4 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-800 font-medium">Helm {loc.id}</span>
                  <span className="text-gray-500 text-sm">⏱ {formatTime(loc.updatedAt)}</span>
                  <span className="text-gray-500 text-sm">📍 {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadge(
                    Date.now() - loc.updatedAt < 3000
                  )}`}
                >
                  {Date.now() - loc.updatedAt < 3000 ? "Online" : "Offline"}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
}
