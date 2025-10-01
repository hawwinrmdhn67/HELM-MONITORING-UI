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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang Admin!",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Username atau password salah!",
      });
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm flex flex-col space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Login Admin
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          Login
        </button>

        <p className="text-center text-gray-500 text-xs sm:text-sm">
          Masukkan username & password admin untuk mengakses dashboard monitoring helm
        </p>
      </form>
    </div>
  );
}
