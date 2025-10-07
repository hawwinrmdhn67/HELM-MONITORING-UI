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
  acceleration?: number; 
}

export default function IncidentAlert() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeStatus = (status?: string) => {
    if (!status) return "Unknown";
    const s = status.toLowerCase();
    if (s === "on") return "On";
    if (s === "alert") return "ALERT";
    if (s === "off") return "Off";
    return "Unknown";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.1.106:3001/api/update-location");
        const data = await res.json();
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
              helm_status:
                normalizeStatus(obj.helm_status) === "ALERT" || merged[id].helm_status === "ALERT"
                  ? "ALERT"
                  : normalizeStatus(obj.helm_status) || merged[id].helm_status,
              incident: merged[id].incident || !!obj.incident,
              acceleration: obj.acceleration ?? merged[id].acceleration,
              updatedAt: Math.max(obj.updatedAt, merged[id].updatedAt),
              source: merged[id].source === "HP" ? "HP + Arduino" : obj.source,
            };
          }
        });

        const finalArr = Object.values(merged).map((item) => {
          let status = normalizeStatus(item.helm_status);
          if (item.incident) {
            status = "ALERT"; 
          }
          return { ...item, helm_status: status };
        });

        const now = Date.now();
        const dummyIncidents: Incident[] = [
          {
            id: "Ayah",
            lat: -7.981,
            lng: 112.630,
            helm_status: "ALERT",
            online: true,
            incident: true,
            updatedAt: now,
            source: "Arduino",
            acceleration: 3.0,
          },
          {
            id: "Ibu",
            lat: -7.250,
            lng: 112.768,
            helm_status: "On",
            online: true,
            incident: false,
            updatedAt: now - 5000,
            source: "HP",
            acceleration: 1.2,
          },
          {
            id: "Anak 1",
            lat: -7.472,
            lng: 112.445,
            helm_status: "Off",
            online: false,
            incident: false,
            updatedAt: now - 10000,
            source: "Arduino",
            acceleration: 0,
          },
          {
            id: "Anak 2",
            lat: -7.555,
            lng: 112.020,
            helm_status: "On",
            online: false,  
            incident: false,
            updatedAt: now - 15000,
            source: "HP",
            acceleration: 2.5,
          },
        ];

        setIncidents([...finalArr, ...dummyIncidents]);
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

  const statusBadge = (helm_status?: string) =>
    helm_status === "On"
      ? "bg-green-100 text-green-700 border border-green-300"
      : helm_status === "ALERT"
      ? "bg-red-100 text-red-700 border border-red-300 animate-pulse"
      : helm_status === "Off"
      ? "bg-red-100 text-red-700 border border-red-300"
      : "bg-gray-100 text-gray-600 border border-gray-300";

  const onlineBadge = (online: boolean) =>
    online
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300";

  const incidentBadge = (incident: boolean) =>
    incident
      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
      : "bg-gray-100 text-gray-600 border border-gray-300";

  const formatTime = (ts?: number) =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {loading ? (
        <p className="text-gray-500">Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <p className="text-gray-500">Belum ada incident...</p>
      ) : (
        incidents.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border transition 
              ${item.helm_status === "ALERT" ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200"}
            `}
          >
            {/* Info utama */}
            <div className="flex flex-col space-y-1">
              <span className="text-gray-800 font-medium">
                Helmet {item.id}
              </span>
              <span className="text-gray-500 text-sm">
                ⏱ {formatTime(item.updatedAt)}
              </span>
              {item.lat !== undefined && item.lng !== undefined && (
                <span className="text-gray-500 text-sm">
                  📍 {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
                </span>
              )}
              {item.acceleration !== undefined && (
                <span className="text-gray-500 text-sm">
                  🌀 Acceleration: {item.acceleration.toFixed(2)} m/s²
                </span>
              )}
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${statusBadge(
                  item.helm_status
                )}`}
              >
                {item.helm_status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${onlineBadge(
                  item.online
                )}`}
              >
                {item.online ? "Online" : "Offline"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${incidentBadge(
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
