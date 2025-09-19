import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Simpan lokasi helm sementara
interface Location {
  lat: number;
  lng: number;
  updatedAt: number;
}
const locations: Record<string, Location> = {};

// Middleware
app.use(cors()); // biar HP bisa akses dari jaringan lain
app.use(express.json());

// Endpoint POST: HP kirim lokasi
app.post("/api/update-location", (req, res) => {
  const { helmet_id, lat, lng } = req.body;

  if (!helmet_id || !lat || !lng) {
    return res.status(400).json({ success: false, error: "Missing data" });
  }

  locations[helmet_id] = {
    lat,
    lng,
    updatedAt: Date.now(),
  };

  console.log(`Lokasi diterima dari ${helmet_id}:`, lat, lng);
  res.json({ success: true });
});

// Endpoint GET: web monitoring fetch lokasi
app.get("/api/update-location", (_req, res) => {
  res.json(locations);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
