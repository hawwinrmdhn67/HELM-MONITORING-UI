"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  MapPin,
  HardHat,
  AlertTriangle,
  Battery,
  Box,
  LogIn,
  LogOut,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(admin);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Sesi admin akan diakhiri.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f50606",
      cancelButtonColor: "#0a82f1",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("isAdmin");
        setIsAdmin(false);
        Swal.fire({
          title: "Logout berhasil",
          text: "Anda telah keluar dari sesi admin.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => router.push("/login"));
      }
    });
  };

  const menuLinks = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
    { name: "GPS", href: "/gps", icon: <MapPin size={18} /> },
    { name: "Helm", href: "/helm", icon: <HardHat size={18} /> },
    { name: "Incident", href: "/incident", icon: <AlertTriangle size={18} /> },
    { name: "Baterai", href: "/baterai", icon: <Battery size={18} /> },
    { name: "3D Model", href: "/3d-model", icon: <Box size={18} /> },
  ];

  const handleMenuClick = (link: any) => {
    router.push(link.href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md border-b border-gray-200 py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50"
      >
        <h1 className="text-lg md:text-xl font-bold text-gray-800">
          Helm Safetronic
        </h1>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-4 items-center">
          {isAdmin &&
            menuLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleMenuClick(link)}
                className="flex items-center gap-2 px-3 py-2 text-sm md:text-base rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <LogIn size={18} />
              Login
            </button>
          )}
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg border-b border-gray-200 flex flex-col px-6 py-4 space-y-4"
          >
            {isAdmin &&
              menuLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    setIsOpen(false);
                    handleMenuClick(link);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  {link.icon}
                  {link.name}
                </button>
              ))}
            {isAdmin ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/login");
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                <LogIn size={18} />
                Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
