import "./styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Monitoring Dashboard",
  description: "Dashboard Monitoring Helm",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark"> 
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
