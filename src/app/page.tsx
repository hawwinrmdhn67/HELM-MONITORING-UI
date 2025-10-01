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

        const gpsFromHp = values.filter(
          (d) => d.lat !== undefined && d.lng !== undefined && d.online
        ).length;
        setGpsOnline(gpsFromHp);

        const helmFromHp = values.filter(
          (d) =>
            d.helm_status &&
            d.helm_status.toLowerCase() === "on" &&
            d.online === true
        ).length;
        setHelmConnected(helmFromHp);

        const incidentsFromArduino = values.filter((d) => d.incident).length;
        setIncidentCount(incidentsFromArduino);
      } catch (err) {
        console.error("Gagal fetch lokasi:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar sticky */}
      <Navbar />

      {/* Supaya tidak ketimpa navbar → kasih pt sesuai tinggi navbar */}
      <main className="flex-1 pt-20 p-4 md:p-6 space-y-8 relative z-0">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-gray-800"
        >
          Dashboard Monitoring
        </motion.h1>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            title="GPS Tracker"
            value={`${gpsOnline} Online`}
            color="green"
          />
          <StatusCard
            title="Helm Status"
            value={`${helmConnected} Connected`}
            color="blue"
          />
          <StatusCard
            title="Incident"
            value={`${incidentCount} Active`}
            color="red"
          />
        </div>

        {/* Map Section */}
        <section className="relative z-0">
          <h2 className="text-xl font-semibold mb-3">Live GPS Tracking</h2>
          <div className="rounded-2xl border border-gray-200 shadow-md overflow-hidden relative z-0">
            <MapComponent />
          </div>
        </section>

        {/* Incident Logs */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Incident Logs</h2>
          <IncidentTable />
        </section>

        {/* Monitoring Chart */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Monitoring</h2>
          <MonitoringChart />
        </section>
      </main>
    </div>
  );
}
