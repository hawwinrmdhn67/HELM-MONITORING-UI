import { NextResponse } from "next/server";

export interface SourceData {
  lat: number;
  lng: number;
  helm_status: "On" | "Off" | "ALERT";
  updatedAt: number;
}

export interface HelmetLocation {
  hp?: SourceData;
  arduino?: SourceData;
  status: "Online" | "Offline";
  incident: boolean;
}

export let locations: Record<string, HelmetLocation> = {};

// ✅ handle preflight (CORS)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

// ✅ menerima data dari HP / Arduino
export async function POST(req: Request) {
  try {
    const {
      helmet_id,
      lat,
      lng,
      helm_status,
      source,
    }: {
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

    if (!locations[helmet_id]) {
      locations[helmet_id] = { status: "Offline", incident: false };
    }

    const src: "HP" | "Arduino" = source || "HP";

    locations[helmet_id][src.toLowerCase() as "hp" | "arduino"] = {
      lat,
      lng,
      helm_status: helm_status || "Off",
      updatedAt: Date.now(),
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

// ✅ ambil status helm
export async function GET() {
  try {
    const now = Date.now();

    const data = Object.fromEntries(
      Object.entries(locations).map(([id, loc]) => {
        const hpOnline = loc.hp ? now - loc.hp.updatedAt < 5000 : false;
        const arduinoOnline = loc.arduino ? now - loc.arduino.updatedAt < 5000 : false;

        // status final: kalau salah satu online → Online
        const status: "Online" | "Offline" =
          hpOnline || arduinoOnline ? "Online" : "Offline";

        // ambil update terbaru
        const latest = [loc.hp, loc.arduino]
          .filter(Boolean)
          .sort((a, b) => (b!.updatedAt - a!.updatedAt))[0];

        return [
          id,
          {
            lat: latest?.lat,
            lng: latest?.lng,
            status,
            incident: loc.arduino?.helm_status === "ALERT" && arduinoOnline,
            updatedAt: latest?.updatedAt,
          },
        ];
      })
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
