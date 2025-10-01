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

        setLocations(arr);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 1000);
    return () => clearInterval(interval);
  }, []);

  const status = (loc: LocationWithId) => {
    const diff = Date.now() - loc.updatedAt;
    return diff < 3000 ? "Online" : "Offline";
  };

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString();

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
          Helm Monitoring
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
                className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium">
                    Helm {loc.id}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Updated: {formatTime(loc.updatedAt)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    📍 {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    status(loc) === "Online"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {status(loc)}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
}
