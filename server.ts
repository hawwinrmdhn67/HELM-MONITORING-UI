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
  source?: "HP" | "Arduino";
}

const locations: Record<string, Location> = {};

app.use(cors());
app.use(express.json());

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
  locations[helmet_id] = {
    ...oldData,
    lat: lat ?? oldData.lat,
    lng: lng ?? oldData.lng,
    speed: speed ?? oldData.speed,
    description: description || oldData.description,
    helm_status: helm_status || oldData.helm_status || "Off", 
    incident: oldData.incident ?? false,
    updatedAt: Date.now(),
    source: "HP",
  };

  } else if (source === "Arduino") {
    const isIncident =
      helm_status === "ALERT" ||
      (acceleration ? acceleration > 1.5 : oldData.incident);

    locations[helmet_id] = {
      ...oldData,
      acceleration: acceleration ?? oldData.acceleration,
      helm_status: isIncident
        ? "ALERT"
        : (helm_status || oldData.helm_status || "On"),
      incident: isIncident,
      updatedAt: Date.now(),
      source: "Arduino",
    };
  }

  console.log("📡 Data masuk dari", source, ":", locations[helmet_id]);
  res.json({ success: true });
});

app.get("/api/update-location", (_req, res) => {
  const now = Date.now();
  const data = Object.fromEntries(
    Object.entries(locations).map(([id, loc]) => [
      id,
      {
        ...loc,
        online: now - loc.updatedAt < 3000, 
      },
    ])
  );
  res.json(data);
});

app.get("/api/status", (_req, res) => {
  const now = Date.now();
  let gpsOnline = 0;
  let helmConnected = 0;

  Object.values(locations).forEach((loc) => {
    const isOnline = now - loc.updatedAt < 3000;
    if (isOnline && loc.source === "HP") gpsOnline++;
    if (isOnline && loc.source === "Arduino") helmConnected++;
  });

  res.json({
    gps_online: gpsOnline,
    helm_connected: helmConnected,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
