"use client";

import Navbar from "../components/Navbar";
import IncidentTable from "../components/IncidentAlert";
import { motion } from "framer-motion";

export default function IncidentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-gray-800"
        >
          Incident Logs
        </motion.h1>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4">
          <IncidentTable />
        </div>
      </main>
    </div>
  );
}
