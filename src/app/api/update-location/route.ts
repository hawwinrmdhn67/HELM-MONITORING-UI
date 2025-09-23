import { NextResponse } from "next/server";

export interface Location {
  lat: number;
  lng: number;
  helm_status?: "On" | "Off" | "ALERT";
  updatedAt: number;
  source: "HP" | "Arduino";
}

// ⬇️ tambahkan export
export let locations: Record<string, Location> = {};

// ✅ handle preflight (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}

export async function POST(req: Request) {
  try {
    const { helmet_id, lat, lng, helm_status, source }: { 
      helmet_id: string; 
      lat: number; 
      lng: number; 
      helm_status?: "On" | "Off" | "ALERT";
      source?: "HP" | "Arduino";
    } = await req.json();

    if (!helmet_id || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { success: false, error: "helmet_id, lat, dan lng wajib diisi" }, 
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    locations[helmet_id] = {
      lat,
      lng,
      helm_status: helm_status || locations[helmet_id]?.helm_status || "Off",
      updatedAt: Date.now(),
      source: source || "HP", // default HP
    };

    return NextResponse.json(
      { success: true }, 
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message }, 
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function GET() {
  try {
    const now = Date.now();
    const data = Object.fromEntries(
      Object.entries(locations).map(([id, loc]) => [
        id,
        {
          ...loc,
          online: now - loc.updatedAt < 3000,
          incident: loc.helm_status === "ALERT" && loc.source === "Arduino",
        },
      ])
    );

    return NextResponse.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message }, 
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
