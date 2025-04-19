import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import {
  FaUserCircle,
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-200">
      {/* Logo / Título */}
      <h1
        className="text-xl font-bold text-green-700 hover:text-green-900 transition cursor-pointer flex items-center gap-1"
        onClick={() => router.push('/')}
      >
        🌸 <span className="hidden sm:inline">OrquideaViva.com</span>
      </h1>

      {/* Controles de navegación */}
      <nav className="flex items-center gap-4 text-sm font-medium">
        {user ? (
          <>
            <span className="text-gray-600 hidden sm:inline">Hola, {user.name}</span>

            <button
              onClick={() => router.push('/perfil')}
              aria-label="Ir al perfil"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
            >
              <FaUserCircle />
              <span className="hidden sm:inline">Perfil</span>
            </button>

            <button
              onClick={() => router.push('/carrito')}
              aria-label="Ver carrito"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
            >
              <FaShoppingCart />
              <span className="hidden sm:inline">Carrito</span>
            </button>

            <button
              onClick={logout}
              aria-label="Cerrar sesión"
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/login')}
              aria-label="Iniciar sesión"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
            >
              <FaSignInAlt />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </button>

            <button
              onClick={() => router.push('/register')}
              aria-label="Registrarse"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
            >
              <FaUserPlus />
              <span className="hidden sm:inline">Registrarse</span>
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
