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
  Legend,
  Label,
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

  const values = data.map((d) => d.value);
  const avg = values.length
    ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
    : "0";
  const max = values.length ? Math.max(...values).toFixed(2) : "0";
  const min = values.length ? Math.min(...values).toFixed(2) : "0";

  return (
    <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-md w-full h-[260px] sm:h-[360px] flex flex-col">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
        Monitoring Chart
      </h2>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="time"
            stroke="#666"
            tick={{ fontSize: 10 }}
            interval="preserveEnd"
          />
          <YAxis stroke="#666" tick={{ fontSize: 10 }}>
            <Label
              value="Acceleration (m/s²)"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle", fill: "#666", fontSize: 11 }}
            />
          </YAxis>
          <Tooltip
            contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #ddd", color: "#111" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", color: "#333" }} />
          <Line
            type="monotone"
            dataKey="value"
            name="Acceleration"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Info ringkasan */}
      <div className="mt-2 text-xs sm:text-sm text-gray-600 flex justify-between">
        <span>Rata-rata: {avg}</span>
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
}
