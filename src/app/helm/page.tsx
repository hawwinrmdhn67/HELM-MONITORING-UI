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
      const res = await fetch("http://localhost:3000/api/update-location"); 
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
    const interval = setInterval(fetchLocations, 3000); 
    return () => clearInterval(interval);
  }, []);

  const status = (loc: LocationWithId) => {
    const diff = Date.now() - loc.updatedAt;
    return diff < 10000 ? "Online" : "Offline";
  };

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold"
        >
          Helm Monitoring
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg space-y-4"
        >
          {locations.length === 0 ? (
            <p className="text-gray-400">Belum ada helm terhubung...</p>
          ) : (
            locations.map((loc) => (
              <div
                key={loc.id}
                className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-gray-200 font-medium">
                    Helm {loc.id}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Updated: {formatTime(loc.updatedAt)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    📍 {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    status(loc) === "Online"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
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
