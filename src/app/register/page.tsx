"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      Swal.fire("Error", "Semua field wajib diisi!", "error");
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire("Error", "Format email tidak valid!", "error");
      return;
    }

    if (password.length < 6) {
      Swal.fire("Error", "Password minimal 6 karakter!", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Password tidak cocok!", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:3002/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // hanya kirim yg dibutuhkan
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Pendaftaran Berhasil",
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Daftar",
          text: data.message || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      Swal.fire("Error", "Tidak bisa terhubung ke server", "error");
    }
  };

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

        {/* Kanan - Form Register */}
        <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
              Register Admin
            </h2>

            <form onSubmit={handleRegister} className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
              />

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
              />

              <input
                type="password"
                placeholder="Password (min 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Daftar
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-3">
              Sudah punya akun?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Login di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
