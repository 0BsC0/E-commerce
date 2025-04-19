import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import {
  FaBoxOpen,
  FaFolderOpen,
  FaArrowLeft
} from 'react-icons/fa';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <aside className="w-60 bg-white border-r h-screen p-6 shadow-sm">
      <nav className="flex flex-col gap-4 text-gray-700">
        {user?.role === 'viverista' && (
          <>
            <Link
              href="/admin/products"
              className={`flex items-center gap-2 font-semibold hover:text-green-600 ${
                isActive('/admin/products') ? 'text-green-600' : ''
              }`}
            >
              <FaBoxOpen /> Productos
            </Link>
            <Link
              href="/admin/categories"
              className={`flex items-center gap-2 font-semibold hover:text-green-600 ${
                isActive('/admin/categories') ? 'text-green-600' : ''
              }`}
            >
              <FaFolderOpen /> Categorías
            </Link>
          </>
        )}

        <Link
          href="/"
          className="mt-10 flex items-center gap-2 text-sm text-gray-400 hover:text-green-600"
        >
          <FaArrowLeft /> Volver al inicio
        </Link>
      </nav>
    </aside>
  );
}
