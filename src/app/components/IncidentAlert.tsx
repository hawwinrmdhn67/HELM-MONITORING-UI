"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Incident {
  id: string;
  lat?: number;
  lng?: number;
  helm_status?: "On" | "Off" | "ALERT" | string;
  online: boolean;
  incident: boolean;
  updatedAt: number;
  source?: "HP" | "Arduino";
  acceleration?: number; // ✅ Tambahin acceleration
}

export default function IncidentAlert() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Normalisasi status agar konsisten
  const normalizeStatus = (status?: string) => {
    if (!status) return "Unknown";
    const s = status.toLowerCase();
    if (s === "on") return "On";
    if (s === "alert") return "ALERT";
    if (s === "off") return "Off";
    return "Unknown";
  };

  // Ambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.1.106:3001/api/update-location");
        const data = await res.json();

        // Gabungkan data dari HP & Arduino berdasarkan id
        const merged: Record<string, Incident> = {};

        Object.entries(data).forEach(([id, obj]: any) => {
          if (!merged[id]) {
            merged[id] = {
              id,
              lat: obj.lat,
              lng: obj.lng,
              helm_status: normalizeStatus(obj.helm_status),
              online: !!obj.online,
              incident: !!obj.incident,
              updatedAt: obj.updatedAt,
              source: obj.source,
              acceleration: obj.acceleration,
            };
          } else {
            merged[id] = {
              ...merged[id],
              lat: obj.lat ?? merged[id].lat,
              lng: obj.lng ?? merged[id].lng,
              // ✅ kalau salah satu status ALERT → tetap ALERT
              helm_status:
                normalizeStatus(obj.helm_status) === "ALERT" || merged[id].helm_status === "ALERT"
                  ? "ALERT"
                  : normalizeStatus(obj.helm_status) || merged[id].helm_status,
              // ✅ kalau salah satu incident true → tetap true
              incident: merged[id].incident || !!obj.incident,
              acceleration: obj.acceleration ?? merged[id].acceleration,
              updatedAt: Math.max(obj.updatedAt, merged[id].updatedAt),
              source: merged[id].source === "HP" ? "HP + Arduino" : obj.source,
            };
          }
        });

        // Sinkronisasi helm_status dengan online & incident
        const finalArr = Object.values(merged).map((item) => {
          let status = normalizeStatus(item.helm_status);

          if (item.incident) {
            status = "ALERT"; 
          }

          return { ...item, helm_status: status };
        });

        setIncidents(finalArr);
      } catch (err) {
        console.error("Failed to fetch incidents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Badge styling
  const statusBadge = (helm_status?: string) =>
    helm_status === "On"
      ? "bg-green-500/20 text-green-400"
      : helm_status === "ALERT"
      ? "bg-red-500/20 text-red-400 animate-pulse"
      : "bg-gray-500/20 text-gray-400";

  const onlineBadge = (online: boolean) =>
    online ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400";

  const incidentBadge = (incident: boolean) =>
    incident ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-700/20 text-gray-400";

  const formatTime = (ts?: number) =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-black/30 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl shadow-lg space-y-4"
    >
      {loading ? (
        <p className="text-gray-400">Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <p className="text-gray-400">Belum ada incident...</p>
      ) : (
        incidents.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg transition 
              ${item.helm_status === "ALERT" ? "bg-red-500/10 border border-red-500/30" : "bg-white/5"}
            `}
          >
            {/* Info utama */}
            <div className="flex flex-col space-y-1">
              <span className="text-gray-200 font-medium">
                Helmet {item.id}{" "}
                <span className="text-gray-200 font-medium">
                </span>
              </span>
              <span className="text-gray-400 text-sm">
                ⏱ {formatTime(item.updatedAt)}
              </span>
              {item.lat !== undefined && item.lng !== undefined && (
                <span className="text-gray-400 text-sm">
                  📍 {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
                </span>
              )}
              {item.acceleration !== undefined && (
                <span className="text-gray-400 text-sm">
                  🌀 Acceleration: {item.acceleration.toFixed(2)} m/s²
                </span>
              )}
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <span
                className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${statusBadge(
                  item.helm_status
                )}`}
              >
                {item.helm_status}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${onlineBadge(
                  item.online
                )}`}
              >
                {item.online ? "Online" : "Offline"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${incidentBadge(
                  item.incident
                )}`}
              >
                {item.incident ? "Incident" : "-"}
              </span>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
}
