"use client";

import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("./MapLeaflet"), { ssr: false });

export default function MapComponent() {
  return (
    <div className="w-full h-[400px] md:h-[600px]">
      <MapLeaflet />
    </div>
  );
}
