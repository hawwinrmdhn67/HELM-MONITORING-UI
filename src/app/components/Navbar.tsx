"use client";

import Link from "next/link";
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
        className="bg-black/30 backdrop-blur-md border-b border-white/10 py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50"
      >
        <h1 className="text-lg md:text-xl font-bold">Monitoring Helm</h1>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-4">
          <Link
            href="/"
            className="px-3 py-2 text-sm md:text-base rounded-lg hover:bg-white/10 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/gps"
            className="px-3 py-2 text-sm md:text-base rounded-lg hover:bg-white/10 transition"
          >
            GPS
          </Link>
          <Link
            href="/helm"
            className="px-3 py-2 text-sm md:text-base rounded-lg hover:bg-white/10 transition"
          >
            Helm
          </Link>
          <Link
            href="/incident"
            className="px-3 py-2 text-sm md:text-base rounded-lg hover:bg-white/10 transition"
          >
            Incident
          </Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
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
            className="md:hidden bg-blue/90 backdrop-blur-md shadow-lg border-b border-white/10 flex flex-col px-6 py-4 space-y-4"
          >
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/gps"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              GPS
            </Link>
            <Link
              href="/helm"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Helm
            </Link>
            <Link
              href="/incident"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Incident
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
