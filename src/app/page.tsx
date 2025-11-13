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
import ActivitySummary from "./components/ActivitySummary";

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

  // Redirect jika bukan admin
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") router.push("/login");
    else setLoading(false);
  }, [router]);

  // Fetch data lokasi dan status helm
  useEffect(() => {
    if (loading) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://10.253.130.20:3001/api/update-location");
        const data: Record<string, LocationData> = await res.json();
        const values = Object.values(data);

        setGpsOnline(values.filter(d => d.online && d.helm_status).length);
        setHelmConnected(values.filter(d => d.helm_status?.toLowerCase() === "on").length);
        setIncidentCount(values.filter(d => d.incident).length);

        if (data["H01"]) {
          const h01 = data["H01"];
          setFamilyData(prev =>
            prev.map(member =>
              member.name === "Helm H01"
                ? {
                    ...member,
                    helm_status: h01.helm_status === "ALERT" ? "Off" : (h01.helm_status || "Off"),
                    online: h01.online || false,
                    incident: h01.incident || false,
                    lat: h01.lat || member.lat,
                    lng: h01.lng || member.lng,
                  }
                : member
            )
          );
        }
      } catch (err) {
        console.error("Gagal fetch lokasi:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); 
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center px-6 md:px-16"
        style={{
          backgroundImage: `url('/img/jalan.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/10"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl w-full text-center flex flex-col gap-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight md:leading-snug text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.8)] font-montserrat">
            Helm Safetronic
          </h1>
          <p className="text-lg md:text-2xl font-semibold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)] max-w-2xl mx-auto font-montserrat">
            Pantau status GPS, helm, dan insiden keluarga anda secara real-time.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-8 bg-gray-50">
        {/* Status Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Status Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatusCard title="GPS Tracker" value={`${gpsOnline} Online`} color="green" />
            <StatusCard title="Helm Status" value={`${helmConnected} Connected`} color="blue" />
            <StatusCard title="Incident" value={`${incidentCount} Active`} color="red" />
            <StatusCard title="Family Helm" value={`${familyData.length} Members`} color="yellow" />
          </div>
        </div>

        {/* Family Helm */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Family Helm</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {familyData.map((member, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedMember(member);
                  if (mapSectionRef.current) {
                    const top = mapSectionRef.current.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}
                className={`p-4 border rounded-xl shadow-sm flex flex-col items-center bg-white relative cursor-pointer hover:shadow-md hover:scale-105 transition-transform ${
                  member.incident ? "blink-red" : ""
                }`}
              >
                {member.incident && (
                  <span className="absolute top-2 right-2 text-orange-500 font-bold text-sm">⚠️</span>
                )}
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
              </div>
            ))}
          </div>
        </section>

        {/* Map */}
        <section ref={mapSectionRef} className="relative z-0">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Live GPS Tracking</h2>
          <div className="rounded-2xl border border-gray-200 shadow-md overflow-hidden relative z-0">
            <MapComponent familyData={familyData} selectedMember={selectedMember} />
          </div>
        </section>

        {/* Incident Logs */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Incident Logs</h2>
          <IncidentTable />
        </section>

        {/* Activity Summary */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Activity Summary</h2>
          <ActivitySummary />
        </section>

        {/* Monitoting Chart */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Monitoring Chart</h2>
          <MonitoringChart />
        </section>
      </main>
    </div>
  );
}
