"use client";

import Navbar from "../components/Navbar";
import ThreeDMode from "../components/ThreeDModel";
import { motion } from "framer-motion";

export default function ThreeDPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-5 p-4 md:p-6 space-y-8 relative z-0">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
        >
          3D Model
        </motion.h1>

        {/* Komponen ThreeDMode yang render GLB */}
        <ThreeDMode />
      </main>
    </div>
  );
}
