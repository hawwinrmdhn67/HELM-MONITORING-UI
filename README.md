# 🛰️ HELM MONITORING UI

**HELM MONITORING UI** adalah aplikasi berbasis web untuk memantau **helm pintar (smart helmet)** secara real-time menggunakan peta interaktif, grafik monitoring, dan visualisasi 3D.  
Proyek ini dibangun dengan **Next.js + TypeScript** di sisi frontend, dan **Express.js + MySQL** di sisi backend.

---

## 🚀 Fitur Utama

- 📍 **Peta Interaktif (Leaflet)** — menampilkan posisi helm berdasarkan data GPS dari HP.  
- 🧭 **Monitoring 3D (Three.js)** — menampilkan visualisasi model helm dalam bentuk 3D.  
- 📊 **Grafik Real-time** — menampilkan data sensor helm seperti kecepatan, akselerasi, dan status.  
- ⚙️ **Autentikasi Pengguna** — halaman login & register dengan validasi JWT dan bcrypt.  
- 🔔 **Deteksi Insiden Otomatis** — mendeteksi kecelakaan berdasarkan akselerasi atau status helm.  
- 🤖 **Integrasi Telegram Bot (Opsional)** — mengirim notifikasi status helm ke Telegram.  
- 💾 **Database MySQL** — menyimpan data pengguna dan catatan aktivitas helm.

---

## 🧩 Teknologi yang Digunakan

| Kategori | Teknologi |
|-----------|------------|
| **Frontend Framework** | Next.js 15, React 19 |
| **Bahasa** | TypeScript |
| **UI & Animasi** | Tailwind CSS, Framer Motion, Lucide React |
| **Visualisasi** | Recharts, Chart.js, Leaflet, Three.js |
| **Backend API** | Express.js |
| **Database** | MySQL (via mysql2) |
| **Autentikasi** | JWT + BcryptJS |
| **Notifikasi** | SweetAlert2, Telegram Bot |
| **Real-time** | WebSocket (ws library) |

---

## 📁 Struktur Folder

```bash
HELM-MONITORING-UI/
│
├── src/
│   ├── app/
│   │   ├── 3d-model/
│   │   ├── baterai/
│   │   ├── gps/
│   │   ├── helm/
│   │   ├── incident/
│   │   ├── login/
│   │   ├── register/
│   │   ├── components/
│   │   │   ├── MapLeaflet.tsx
│   │   │   ├── MonitoringChart.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── StatusCard.tsx
│   │   │   └── ThreeDModel.tsx
│   │
│   └── styles/
│       ├── globals.css
│       ├── layout.tsx
│
├── server.js          # Backend API (Express + MySQL)
├── db.js              # Koneksi Database
├── bot_telegram/      # Folder bot Telegram opsional
├── tabel.sql          # Struktur database
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