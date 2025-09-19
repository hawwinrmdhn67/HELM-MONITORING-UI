"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  value: string;
  color: string;
};

export default function StatusCard({ title, value, color }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 md:p-6 rounded-2xl shadow-lg text-white ${color}`}
    >
      <h3 className="text-base md:text-lg font-semibold">{title}</h3>
      <p className="text-xl md:text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}
