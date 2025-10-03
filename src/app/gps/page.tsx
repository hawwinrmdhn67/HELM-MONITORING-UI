"use client";

import Navbar from "../components/Navbar";
import MapLeaflet from "../components/MapLeaflet";
import { motion } from "framer-motion";

export default function GpsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar selalu di atas */}
      <Navbar />

      <main className="flex-1 pt-20 p-4 md:p-6 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-gray-800"
        >
          GPS Tracking
        </motion.h1>

        <MapLeaflet />
      </main>
    </div>
  );
}