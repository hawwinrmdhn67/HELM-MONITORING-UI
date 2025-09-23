import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

interface Location {
  lat?: number;
  lng?: number;
  helm_status?: string;
  updatedAt: number;
  acceleration?: number;
  speed?: number;
  description?: string;
  source?: "HP" | "Arduino";
}

const locations: Record<string, Location> = {};

app.use(cors());
app.use(express.json());

// POST: update lokasi
app.post("/api/update-location", (req, res) => {
  const { helmet_id, lat, lng, helm_status, acceleration, speed, description, source } = req.body;

  if (!helmet_id) {
    return res.status(400).json({ success: false, error: "helmet_id wajib diisi" });
  }

  const oldData = locations[helmet_id] || {};

  locations[helmet_id] = {
    lat: lat !== undefined ? lat : oldData.lat,
    lng: lng !== undefined ? lng : oldData.lng,
    helm_status: helm_status || oldData.helm_status || "UNKNOWN",
    acceleration: acceleration !== undefined ? acceleration : oldData.acceleration,
    speed: speed !== undefined ? speed : oldData.speed,
    description: description || oldData.description,
    source: source || "HP",
    updatedAt: Date.now(),
  };

  console.log("📡 Data masuk dari", source || "HP", ":", locations[helmet_id]);

  res.json({ success: true });
});

// GET: ambil semua lokasi
app.get("/api/update-location", (_req, res) => {
  const now = Date.now();
  const data = Object.fromEntries(
    Object.entries(locations).map(([id, loc]) => [
      id,
      {
        ...loc,
        online: now - loc.updatedAt < 3000, // online kalau < 10 detik
        incident: loc.helm_status === "ALERT" && loc.source === "Arduino",
      },
    ])
  );
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
