import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center border-b border-gray-200">
      <h1
        className="text-xl font-bold text-green-700 cursor-pointer"
        onClick={() => router.push('/')}
      >
        🌸 OrquideaViva.com
      </h1>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-gray-600 hidden sm:inline">Hola, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </>
        )}

        <button
          onClick={() => router.push('/perfil')}
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
        >
          <FaUserCircle />
          <span className="hidden sm:inline">Perfil</span>
        </button>

        <button
          onClick={() => router.push('/carrito')}
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
        >
          <FaShoppingCart />
          <span className="hidden sm:inline">Carrito</span>
        </button>
      </div>
    </header>
  );
}
