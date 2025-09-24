import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

interface Location {
  lat?: number;
  lng?: number;
  helm_status?: string;
  acceleration?: number;
  speed?: number;
  description?: string;
  incident?: boolean;
  updatedAt: number;
}

const locations: Record<string, Location> = {};

app.use(cors());
app.use(express.json());

// ✅ POST: update lokasi
app.post("/api/update-location", (req, res) => {
  const {
    helmet_id,
    lat,
    lng,
    helm_status,
    acceleration,
    speed,
    description,
    source,
  } = req.body;

  if (!helmet_id) {
    return res
      .status(400)
      .json({ success: false, error: "helmet_id wajib diisi" });
  }

  const oldData = locations[helmet_id] || {};

  if (source === "HP") {
    // HP update posisi & helm status
    locations[helmet_id] = {
      ...oldData,
      lat: lat ?? oldData.lat,
      lng: lng ?? oldData.lng,
      helm_status: helm_status || oldData.helm_status || "UNKNOWN",
      speed: speed ?? oldData.speed,
      description: description || oldData.description,
      updatedAt: Date.now(),
    };
  } else if (source === "Arduino") {
    // Arduino update sensor & incident
    locations[helmet_id] = {
      ...oldData,
      acceleration: acceleration ?? oldData.acceleration,
      incident: acceleration ? acceleration > 1.5 : oldData.incident, // contoh threshold
      updatedAt: Date.now(),
    };
  }

  console.log("📡 Data masuk dari", source, ":", locations[helmet_id]);
  res.json({ success: true });
});

// ✅ GET: ambil semua lokasi
app.get("/api/update-location", (_req, res) => {
  const now = Date.now();
  const data = Object.fromEntries(
    Object.entries(locations).map(([id, loc]) => [
      id,
      {
        ...loc,
        online: now - loc.updatedAt < 3000, // online kalau update < 3 detik
      },
    ])
  );
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
