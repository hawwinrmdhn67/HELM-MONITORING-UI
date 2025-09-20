"use client";

import Navbar from "./components/Navbar";
import StatusCard from "./components/StatusCard";
import MapComponent from "./components/MapComponent";
import IncidentTable from "./components/IncidentAlert";
import MonitoringChart from "./components/MonitoringChart";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 space-y-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold"
        >
          Dashboard Monitoring
        </motion.h1>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusCard title="GPS Tracker" value="1 Online" color="bg-green-500" />
          <StatusCard title="Helm Status" value="3 Connected" color="bg-blue-500" />
          <StatusCard title="Incident" value="3 Active" color="bg-red-500" />
        </div>

        {/* Map */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Live GPS Tracking</h2>
          <MapComponent />
        </div>

        {/* Incident Logs */}
        <IncidentTable />

        {/* Monitoring Chart */}
        <MonitoringChart />
      </main>
    </div>
  );
}
