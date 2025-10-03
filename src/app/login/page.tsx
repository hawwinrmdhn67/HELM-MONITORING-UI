"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Selamat datang ${data.user.username}!`,
        timer: 1500,
        showConfirmButton: false,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("isAdmin", "true");

      router.push("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: data.message,
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Tidak bisa terhubung ke server",
    });
  }
};

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col md:flex-row w-full max-w-3xl shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
        
        {/* Kiri - Card Foto */}
        <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
          <img
            src="/img/helm1.webp"
            alt="Helm Monitoring"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Kanan - Form Login */}
        <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
              Login Admin
            </h2>

            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Login
              </button>
            </form>

            {/* Tambahan link daftar */}
            <p className="text-center text-gray-500 text-sm mt-6">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Daftar disini
              </a>
            </p>
            
            <p className="text-center text-gray-400 text-xs mt-4">
              Masukkan username dan password admin untuk mengakses dashboard helm
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
