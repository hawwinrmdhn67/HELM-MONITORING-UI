import { NextResponse } from "next/server";

let locations: Record<string, { lat: number; lng: number; updatedAt: number }> = {};

export async function POST(req: Request) {
  try {
    const { helmet_id, lat, lng } = await req.json();

    locations[helmet_id] = {
      lat,
      lng,
      updatedAt: Date.now(),
    };

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message });
  }
}

export async function GET() {
  try {
    return NextResponse.json(locations);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message });
  }
}
