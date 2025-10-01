"use client";

import Link from "next/link";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md border-b border-gray-200 py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50"
      >
        <h1 className="text-lg md:text-xl font-bold text-gray-800">
          Monitoring Helm
        </h1>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-4">
          <Link
            href="/"
            className="px-3 py-2 text-sm md:text-base rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/gps"
            className="px-3 py-2 text-sm md:text-base rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            GPS
          </Link>
          <Link
            href="/helm"
            className="px-3 py-2 text-sm md:text-base rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Helm
          </Link>
          <Link
            href="/incident"
            className="px-3 py-2 text-sm md:text-base rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Incident
          </Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Dropdown Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg border-b border-gray-200 flex flex-col px-6 py-4 space-y-4"
          >
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/gps"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              GPS
            </Link>
            <Link
              href="/helm"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Helm
            </Link>
            <Link
              href="/incident"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Incident
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
=======
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
      confirmButtonColor: "#f50606ff",
      cancelButtonColor: "#0a82f1ff",
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

  const menuLinks = ["Dashboard", "GPS", "Helm", "Incident"];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
      <h1 className="text-lg md:text-xl font-bold text-gray-800">Monitoring Helm</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 items-center">
        {isAdmin &&
          menuLinks.map((page) => (
            <Link
              key={page}
              href={`/${page.toLowerCase() === "dashboard" ? "" : page.toLowerCase()}`}
              className="px-3 py-2 text-sm md:text-base rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              {page}
            </Link>
          ))}
        {isAdmin ? (
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-200 flex flex-col space-y-2 py-4 px-6 z-40"
          >
            {isAdmin &&
              menuLinks.map((page) => (
                <Link
                  key={page}
                  href={`/${page.toLowerCase() === "dashboard" ? "" : page.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  {page}
                </Link>
              ))}
            {isAdmin ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
>>>>>>> 4e9596d (Update terus jing)
  );
}
