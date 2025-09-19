"use client";

import { motion } from "framer-motion";

const incidents = [
  { id: 1, name: "Sensor Error", status: "Critical", time: "10:30 AM" },
  { id: 2, name: "Helmet Disconnected", status: "Warning", time: "11:15 AM" },
  { id: 3, name: "Battery Low", status: "Normal", time: "01:45 PM" },
];

export default function IncidentTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-black/30 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4">Incident Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-white/10 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Incident</th>
              <th className="p-3">Status</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-white/10 ${
                  index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                } hover:bg-white/20 transition`}
              >
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs md:text-sm ${
                      item.status === "Critical"
                        ? "bg-red-500"
                        : item.status === "Warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
