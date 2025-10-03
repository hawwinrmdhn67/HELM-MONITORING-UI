"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import StatusCard from "./components/StatusCard";
import MapComponent from "./components/MapComponent";
import IncidentTable from "./components/IncidentAlert";
import MonitoringChart from "./components/MonitoringChart";
import { GiHelmet } from "react-icons/gi";
import { motion } from "framer-motion";

interface FamilyMember {
  name: string;
  helm_status: "On" | "Off";
  online: boolean;
  incident?: boolean;
  lat?: number;
  lng?: number;
}

interface LocationData {
  helm_status?: "On" | "Off" | "ALERT";
  online?: boolean;
  incident?: boolean;
  lat?: number;
  lng?: number;
}

export default function HomePage() {
  const router = useRouter();
  const [gpsOnline, setGpsOnline] = useState(0);
  const [helmConnected, setHelmConnected] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const [familyData, setFamilyData] = useState<FamilyMember[]>([
    { name: "Helm H01", helm_status: "Off", online: false, incident: false, lat: -7.0258667, lng: 112.4788683 },
    { name: "Ayah", helm_status: "On", online: true, lat: -7.981, lng: 112.63 },
    { name: "Ibu", helm_status: "Off", online: false, lat: -7.25, lng: 112.768 },
    { name: "Anak 1", helm_status: "On", online: true, lat: -7.472, lng: 112.445 },
    { name: "Anak 2", helm_status: "Off", online: false, lat: -7.555, lng: 112.02 },
  ]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") router.push("/login");
    else setLoading(false);
  }, [router]);

  useEffect(() => {
    if (loading) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.1.106:3001/api/update-location");
        const data: Record<string, LocationData> = await res.json();
        const values = Object.values(data);

        setGpsOnline(values.filter(d => d.online && d.helm_status).length);
        setHelmConnected(values.filter(d => d.helm_status?.toLowerCase() === "on").length);
        setIncidentCount(values.filter(d => d.incident).length);

        if (data["H01"]) {
          const h01 = data["H01"];
          setFamilyData(prev => {
            const newFamily = [...prev];
            newFamily[0] = {
              name: "Helm H01",
              helm_status: h01.helm_status === "ALERT" ? "Off" : (h01.helm_status || "Off"),
              online: h01.online || false,
              incident: h01.incident || false,
              lat: h01.lat || prev[0].lat,
              lng: h01.lng || prev[0].lng,
            };
            return newFamily;
          });
        }
      } catch (err) {
        console.error("Gagal fetch lokasi:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-5 p-4 md:p-6 space-y-8 relative z-0">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-gray-800"
        >
          Dashboard Monitoring
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusCard title="GPS Tracker" value={`${gpsOnline} Online`} color="green" />
          <StatusCard title="Helm Status" value={`${helmConnected} Connected`} color="blue" />
          <StatusCard title="Incident" value={`${incidentCount} Active`} color="red" />
          <StatusCard title="Family Helm" value={`${familyData.length} Members`} color="yellow" />
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Family Helm</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {familyData.map((member, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedMember(member);
                  mapSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="p-4 border rounded-xl shadow-sm flex flex-col items-center bg-white relative cursor-pointer hover:shadow-md transition"
              >
                <GiHelmet
                  size={36}
                  className={`mb-2 ${member.helm_status === "On" ? "text-green-600" : "text-gray-400"}`}
                />
                <p className="font-semibold text-gray-900">{member.name}</p>
                <p className={`mt-2 font-medium ${member.helm_status === "On" ? "text-green-600" : "text-gray-900"}`}>
                  {member.helm_status}
                </p>
                <p className={`mt-1 text-sm ${member.online ? "text-green-500" : "text-red-500"}`}>
                  {member.online ? "Online" : "Offline"}
                </p>
                {member.incident && <span className="text-orange-500 font-bold">⚠️ Incident Detected!</span>}
              </div>
            ))}
          </div>
        </section>

        <section ref={mapSectionRef} className="relative z-0">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Live GPS Tracking</h2>
          <div className="rounded-2xl border border-gray-200 shadow-md overflow-hidden relative z-0">
            <MapComponent familyData={familyData} selectedMember={selectedMember} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Incident Logs</h2>
          <IncidentTable />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Monitoring Chart</h2>
          <MonitoringChart />
        </section>
      </main>
    </div>
  );
}
