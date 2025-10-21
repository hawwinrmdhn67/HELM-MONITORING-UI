"use client";

import { motion } from "framer-motion";
import StatusCard from "./StatusCard";

export default function ActivitySummary() {
  return (
    <section>
      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatusCard
          title="Total Distance"
          value={
            <>
              12.4 km
              <span className="block text-sm text-gray-500 font-normal mt-1">
                +2.1 km dari minggu lalu
              </span>
            </>
          }
          color="yellow"
        />

        <StatusCard
          title="Total Duration"
          value={
            <>
              45m 21s
              <span className="block text-sm text-gray-500 font-normal mt-1">
                +5 menit dibanding rata-rata
              </span>
            </>
          }
          color="blue"
        />

        <StatusCard
          title="Average Speed"
          value={
            <>
              16.5 km/h
              <span className="block text-sm text-gray-500 font-normal mt-1">
                Rekor minggu ini
              </span>
            </>
          }
          color="green"
        />
      </motion.div>

      {/* Activity History */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-8 bg-white rounded-2xl p-6 shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activities
        </h3>
        <div className="space-y-4">
          {[
            {
              date: "21 Okt 2025",
              distance: "6.2 km",
              duration: "23m 10s",
              speed: "16.1 km/h",
            },
            {
              date: "20 Okt 2025",
              distance: "4.8 km",
              duration: "19m 05s",
              speed: "15.2 km/h",
            },
            {
              date: "19 Okt 2025",
              distance: "8.1 km",
              duration: "31m 44s",
              speed: "15.4 km/h",
            },
          ].map((act, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-semibold text-gray-800">{act.date}</p>
                <p className="text-sm text-gray-500">
                  {act.distance} • {act.duration}
                </p>
              </div>
              <p className="font-semibold text-orange-600">{act.speed}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
