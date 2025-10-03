"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface FamilyMember {
  name: string;
  helm_status: "On" | "Off";
  online: boolean;
  incident?: boolean;
  lat?: number;
  lng?: number;
}

function FlyToLocation({
  member,
  markerRefs,
}: {
  member: FamilyMember | null;
  markerRefs: React.MutableRefObject<Record<string, LeafletMarker | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (member && member.lat && member.lng) {
      map.flyTo([member.lat, member.lng], 13, { duration: 1.5 });
      const marker = markerRefs.current[member.name];
      if (marker) {
        setTimeout(() => marker.openPopup(), 600);
      }
    }
  }, [member, map, markerRefs]);

  return null;
}

export default function MapComponent({
  familyData,
  selectedMember,
}: {
  familyData: FamilyMember[];
  selectedMember: FamilyMember | null;
}) {
  const center: [number, number] = [
    familyData[0]?.lat || -7.0258667,
    familyData[0]?.lng || 112.4788683,
  ];

  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

  return (
    <MapContainer
      center={center}
      zoom={8}
      className="w-full h-[400px] md:h-[600px] rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {familyData.map(
        (member, idx) =>
          member.lat &&
          member.lng && (
            <Marker
              key={idx}
              position={[member.lat, member.lng]}
              ref={(el) => {
                if (el) markerRefs.current[member.name] = el;
              }}
            >
              <Popup>
                <div className="text-sm">
                  <b>{member.name}</b> <br />
                  Status:{" "}
                  <span
                    className={
                      member.helm_status === "On"
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {member.helm_status}
                  </span>
                  <br />
                  {member.online ? (
                    <span className="text-green-500">Online</span>
                  ) : (
                    <span className="text-red-500">Offline</span>
                  )}
                  <br />
                  {member.incident && (
                    <span className="text-orange-500 font-bold">
                      ⚠️ Incident Detected!
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          )
      )}
      <FlyToLocation member={selectedMember} markerRefs={markerRefs} />
    </MapContainer>
  );
}
