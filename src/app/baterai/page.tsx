"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { BatteryFull, BatteryCharging, BatteryLow } from "lucide-react";
import { motion } from "framer-motion";

interface BatteryData {
  id: number;
  name: string;
  level: number; 
  charging: boolean;
}

const initialData: BatteryData[] = [
  { id: 0, name: "Helm H01", level: 100, charging: false },
  { id: 1, name: "Ayah", level: 80, charging: false },
  { id: 2, name: "Ibu", level: 60, charging: true },
  { id: 3, name: "Anak 1", level: 30, charging: false },
  { id: 4, name: "Anak 2", level: 15, charging: false },
];

export default function Baterai() {
  const [members, setMembers] = useState<BatteryData[]>(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setMembers((prev) =>
        prev.map((m) => ({
          ...m,
          level: Math.max(0, Math.min(100, m.level + (m.charging ? 5 : -1))),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (level: number, charging: boolean) => {
    if (charging) return "blue";
    if (level > 50) return "green";
    if (level > 20) return "yellow";
    return "red";
  };

  const getValueText = (level: number, charging: boolean) =>
    `${level}% ${charging ? "(Charging)" : ""}`;

  const getBatteryIcon = (level: number, charging: boolean) => {
    const size = 24 + (level / 100) * 12;
    if (charging) return <BatteryCharging className="text-blue-500" style={{ width: size, height: size }} />;
    if (level > 50) return <BatteryFull className="text-green-500" style={{ width: size, height: size }} />;
    return <BatteryLow className="text-red-500" style={{ width: size, height: size }} />;
  };

  const statusBadge = (level: number, charging: boolean) => {
    if (charging) return "bg-blue-100 text-blue-700 border border-blue-300";
    if (level > 50) return "bg-green-100 text-green-700 border border-green-300";
    if (level > 20) return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    return "bg-red-100 text-red-700 border border-red-300";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-gray-800"
        >
          Battery Status
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-md space-y-4"
        >
          {members.map((m) => (
            <div
              key={m.id}
              className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {getBatteryIcon(m.level, m.charging)}
                  <span className="font-medium text-gray-800">{m.name}</span>
                </div>
                <span className="text-gray-500 text-sm">{getValueText(m.level, m.charging)}</span>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-2 rounded-full ${
                      m.charging
                        ? "bg-blue-500"
                        : getColor(m.level, m.charging) === "green"
                        ? "bg-green-500"
                        : getColor(m.level, m.charging) === "yellow"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.level}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* Badge status */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadge(
                  m.level,
                  m.charging
                )}`}
              >
                {m.charging ? "Charging" : m.level > 50 ? "Good" : m.level > 20 ? "Low" : "Critical"}
              </span>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
