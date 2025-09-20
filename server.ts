import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

interface Location {
  lat: number;
  lng: number;
  updatedAt: number;
}
const locations: Record<string, Location> = {};

app.use(cors()); 
app.use(express.json());

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

app.get("/api/update-location", (_req, res) => {
  res.json(locations);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
