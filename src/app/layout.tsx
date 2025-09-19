import "./styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Monitoring Dashboard",
  description: "Dashboard Monitoring Helm",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}
