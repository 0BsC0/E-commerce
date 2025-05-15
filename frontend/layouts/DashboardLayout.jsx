import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-green-50 relative">
      {/* Navbar superior */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar lateral solo para viveristas */}
        {user?.role === "viverista" && (
          <aside className="hidden md:block w-64 bg-white shadow-sm border-r overflow-y-auto">
            <Sidebar />
          </aside>
        )}

        {/* Contenido principal con scroll independiente */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
