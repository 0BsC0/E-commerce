import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <aside className="w-60 bg-white border-r h-screen p-6 shadow-sm">
      <nav className="flex flex-col gap-4 text-gray-700">
        {user?.role === 'viverista' && (
          <>
            <Link
              href="/admin/products"
              className="hover:text-green-600 font-semibold"
            >
              📦 Productos
            </Link>
            <Link
              href="/admin/categories"
              className="hover:text-green-600 font-semibold"
            >
              🗂 Categorías
            </Link>
          </>
        )}
        <Link
          href="/"
          className="mt-10 text-sm text-gray-400 hover:text-green-600"
        >
          ← Volver al inicio
        </Link>
      </nav>
    </aside>
  );
}
