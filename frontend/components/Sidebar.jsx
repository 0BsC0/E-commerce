import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import {
  FaBoxOpen,
  FaClipboardList,
  FaArrowLeft
} from "react-icons/fa";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  const linkClasses = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive(path)
        ? "bg-green-100 text-green-700"
        : "text-gray-600 hover:text-green-700 hover:bg-green-50"
    }`;

  return (
    <aside className="w-full md:w-64 bg-white border-r md:min-h-screen p-4 md:p-6 shadow-sm">
      <nav className="flex flex-col gap-4 text-sm font-medium">
        {user?.role === "viverista" && (
          <>
            <div className="text-xs text-gray-400 uppercase tracking-wide pl-1 mb-1">
              Panel Viverista
            </div>

            <Link
              href="/admin/products"
              className={linkClasses("/admin/products")}
              aria-current={isActive("/admin/products") ? "page" : undefined}
            >
              <FaBoxOpen className="text-base" />
              <span>Productos</span>
            </Link>

            <Link
              href="/admin/products/orders"
              className={linkClasses("/admin/products/orders")}
              aria-current={isActive("/admin/products/orders") ? "page" : undefined}
            >
              <FaClipboardList className="text-base" />
              <span>Órdenes recibidas</span>
            </Link>
          </>
        )}

        <hr className="my-4 border-gray-200" />

        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-green-600 text-sm"
        >
          <FaArrowLeft className="text-base" />
          <span>Volver al inicio</span>
        </Link>
      </nav>
    </aside>
  );
}
