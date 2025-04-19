// layouts/DashboardLayout.jsx
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar solo para viveristas */}
      {user?.role === "viverista" && (
        <aside className="hidden md:block w-60 bg-white shadow-sm border-r">
          <Sidebar />
        </aside>
      )}

      <div className="flex flex-col flex-1">
        {/* Navbar superior */}
        <header className="shadow-sm">
          <Navbar />
        </header>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
