"use client";

import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function HelmPage() {
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
          className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg"
        >
          <p className="text-gray-200">
            Di sini kamu bisa menampilkan status helm (misalnya: koneksi, sensor,
            baterai, dll). Bisa juga ditambahkan grafik untuk kondisi helm realtime.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
