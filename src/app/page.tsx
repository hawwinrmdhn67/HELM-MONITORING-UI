"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import StatusCard from "./components/StatusCard";
import MapComponent from "./components/MapComponent";
import IncidentTable from "./components/IncidentAlert";
import MonitoringChart from "./components/MonitoringChart";
import { motion } from "framer-motion";

export default function HomePage() {
  const [gpsOnline, setGpsOnline] = useState(0);
  const [helmConnected, setHelmConnected] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("http://192.168.1.106:3001/api/update-location");
      const data = await res.json();

      const values = Object.values(data) as any[];

      // ✅ GPS dari data yang punya lat+lng dan online
      const gpsFromHp = values.filter(
        (d) => d.lat !== undefined && d.lng !== undefined && d.online
      ).length;
      setGpsOnline(gpsFromHp);

      // ✅ Helm Status dari semua device yang helm_status = "On" (tidak tergantung GPS)
      const helmFromHp = values.filter((d) => d.helm_status === "On").length;
      setHelmConnected(helmFromHp);

      // ✅ Incident dari Arduino (sudah dihitung di backend → field incident = true)
      const incidentsFromArduino = values.filter((d) => d.incident).length;
      setIncidentCount(incidentsFromArduino);
    } catch (err) {
      console.error("Gagal fetch lokasi:", err);
    }
  };

  fetchData();
  const interval = setInterval(fetchData, 1000); // refresh tiap 1 detik
  return () => clearInterval(interval);
}, []);

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
          <StatusCard
            title="GPS Tracker"
            value={`${gpsOnline} Online`}
            color="bg-green-500"
          />
          <StatusCard
            title="Helm Status"
            value={`${helmConnected} Connected`}
            color="bg-blue-500"
          />
          <StatusCard
            title="Incident"
            value={`${incidentCount} Active`}
            color="bg-red-500"
          />
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
