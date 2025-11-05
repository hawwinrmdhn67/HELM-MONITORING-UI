# 🛰️ HELM MONITORING UI

HELM MONITORING UI adalah aplikasi berbasis web yang digunakan untuk **memantau sistem Helm** secara interaktif melalui **dashboard visual 2D dan 3D**.  
Proyek ini dibangun menggunakan **Next.js (React + TypeScript)** dengan integrasi **Leaflet Maps**, **Three.js**, dan **Chart.js** untuk visualisasi data.

---

## 🚀 Fitur Utama

- 📍 **Peta Interaktif (Leaflet)** — Menampilkan posisi GPS perangkat atau node Helm.  
- 🧭 **Monitoring 3D (Three.js)** — Menampilkan model 3D untuk pemantauan visual sistem.  
- 📊 **Grafik Real-time** — Statistik aktivitas dan data sensor ditampilkan dalam grafik dinamis.  
- ⚙️ **Sistem Login & Register** — Menggunakan autentikasi JWT dengan enkripsi `bcryptjs`.  
- 🔔 **Incident & Alert System** — Menampilkan peringatan kejadian atau status abnormal sistem.  
- 💾 **Koneksi Database MySQL** — Menyimpan data aktivitas, pengguna, dan status perangkat.  
- 🤖 **Integrasi Telegram Bot (opsional)** — Mengirimkan notifikasi otomatis ke Telegram.  

---

## 🧩 Teknologi yang Digunakan

| Kategori | Teknologi |
|-----------|------------|
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) + React 19 |
| **Bahasa** | TypeScript |
| **UI & Animasi** | Tailwind CSS, Framer Motion, Lucide React |
| **Visualisasi** | Recharts, React-Chartjs-2, Three.js, Leaflet |
| **Backend API** | Express.js |
| **Database** | MySQL (via mysql2) |
| **Autentikasi** | JWT + BcryptJS |
| **Notifikasi** | SweetAlert2 + (opsional) Telegram Bot |
| **Real-time** | WebSocket (`ws` library) |

---

## 📂 Struktur Folder

HELM-MONITORING-UI/
│
├── src/
│ ├── app/
│ │ ├── 3d-model/
│ │ ├── baterai/
│ │ ├── gps/
│ │ ├── helm/
│ │ ├── incident/
│ │ ├── login/
│ │ ├── register/
│ │ ├── components/
│ │ │ ├── MapLeaflet.tsx
│ │ │ ├── MonitoringChart.tsx
│ │ │ ├── Navbar.tsx
│ │ │ ├── StatusCard.tsx
│ │ │ ├── ThreeDModel.tsx
│ │ └── ...
│ │
│ └── styles/
│ ├── globals.css
│ ├── layout.tsx
│
├── server.js # Backend API (Express + MySQL)
├── db.js # Koneksi Database
├── bot_telegram/ # Folder bot Telegram opsional
├── tabel.sql # Struktur database
├── next.config.ts
├── package.json
└── tsconfig.json


---

## ⚙️ Instalasi & Menjalankan Proyek

### 1️⃣ Clone Repository
```bash
git clone https://github.com/hawwinrmdhn67/HELM-MONITORING-UI.git
cd HELM-MONITORING-UI
npm install

Setup Environment

Buat file .env.local di root proyek dan isi dengan konfigurasi seperti:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=helm_monitoring
JWT_SECRET=your_secret_key
TELEGRAM_TOKEN=your_bot_token

Jalankan Server

# Jalankan backend (Express)
node server.js (untuk mysql nya)
npx ts-node server.ts (untuk mengambil data status lokasi)

# Jalankan frontend (Next.js)
npm run dev

Kemudian buka di browser:
http://localhost:3000