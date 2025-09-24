"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "09:00", value: 20 },
  { time: "10:00", value: 35 },
  { time: "11:00", value: 50 },
  { time: "12:00", value: 65 },
  { time: "13:00", value: 45 },
  { time: "14:00", value: 70 },
];

export default function MonitoringChart() {
  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl shadow-lg w-full h-[300px] md:h-[350px]">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Monitoring Charts</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="time" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
