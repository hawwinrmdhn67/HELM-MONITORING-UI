import { motion } from "framer-motion";

interface StatusCardProps {
  title: string;
  value: string | React.ReactNode;
  color: "green" | "blue" | "red" | "yellow";
}

export default function StatusCard({ title, value, color }: StatusCardProps) {
  const borderColor =
    color === "green"
      ? "border-green-500 text-green-600"
      : color === "blue"
      ? "border-blue-500 text-blue-600"
      : color === "red"
      ? "border-red-500 text-red-600"
      : "border-yellow-500 text-yellow-600"; 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor}`}
    >
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
