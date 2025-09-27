"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  time: string;
  value: number;
}

export default function MonitoringChart() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.1.106:3001/api/update-location");
        const json = await res.json();
        const entries = Object.values(json) as any[];
        if (entries.length === 0) return;
        
        const latest = entries[0];
        const updated =
          typeof latest.updatedAt === "number"
            ? new Date(latest.updatedAt)
            : new Date(latest.updatedAt);

        const time = isNaN(updated.getTime())
          ? "N/A"
          : updated.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

        const newPoint = {
          time,
          value: latest.acceleration ?? 0,
        };

        setData((prev) => [...prev, newPoint].slice(-10)); 
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/10 p-3 sm:p-5 rounded-2xl shadow-lg w-full h-[220px] sm:h-[320px]">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        Monitoring Chart Helm
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="time"
            stroke="#ccc"
            tick={{ fontSize: 10 }}
            interval="preserveEnd"
          />
          <YAxis stroke="#ccc" tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#60a5fa"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
