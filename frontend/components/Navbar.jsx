import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useToastContext } from "@/context/ToastContext";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/router";
import {
  FaUserCircle,
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useToastContext();
  const { cartItemCount } = useCartContext();
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => setShowConfirm(true);

  const confirmLogout = () => {
    logout();
    setShowConfirm(false);
    showToast("success", "Has cerrado sesión exitosamente.");
    router.push("/");
  };

  const linkClasses = (path) =>
    `flex items-center gap-2 px-3 py-2 text-sm transition font-medium ${
      router.pathname === path
        ? "text-green-700 border-b-2 border-green-700"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 lg:px-10 z-30">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <h1
          className="text-xl font-bold text-green-700 hover:text-green-900 transition cursor-pointer flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          🌸 <span className="hidden sm:inline">OrquideaViva.com</span>
        </h1>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-600 hover:text-green-600 focus:outline-none"
        >
          {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>

        {/* Navegación escritorio */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <span className="text-gray-600 hidden sm:inline">
                Hola, <strong>{user.name}</strong>
              </span>

              <button onClick={() => router.push("/perfil")} className={linkClasses("/perfil")}>
                <FaUserCircle />
                <span className="hidden sm:inline">Perfil</span>
              </button>

              {user.role === "customer" && (
                <>
                  <button onClick={() => router.push("/mis-pedidos")} className={linkClasses("/mis-pedidos")}>
                    <FaClipboardList />
                    <span className="hidden sm:inline">Mis pedidos</span>
                  </button>

                  <button onClick={() => router.push("/carrito")} className={linkClasses("/carrito") + " relative"}>
                    <FaShoppingCart />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                        {cartItemCount}
                      </span>
                    )}
                    <span className="hidden sm:inline">Carrito</span>
                  </button>
                </>
              )}

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/login")} className={linkClasses("/login")}>
                <FaSignInAlt />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </button>

              <button onClick={() => router.push("/register")} className={linkClasses("/register")}>
                <FaUserPlus />
                <span className="hidden sm:inline">Registrarse</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Menú móvil expandido */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-3 pb-4 px-2 border-t border-gray-200">
          {user ? (
            <>
              <button onClick={() => router.push("/perfil")} className={linkClasses("/perfil")}>
                <FaUserCircle /> Perfil
              </button>

              {user.role === "customer" && (
                <>
                  <button onClick={() => router.push("/mis-pedidos")} className={linkClasses("/mis-pedidos")}>
                    <FaClipboardList /> Mis pedidos
                  </button>

                  <button onClick={() => router.push("/carrito")} className={linkClasses("/carrito") + " relative"}>
                    <FaShoppingCart />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                        {cartItemCount}
                      </span>
                    )}
                    Carrito
                  </button>
                </>
              )}

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium"
              >
                <FaSignOutAlt /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/login")} className={linkClasses("/login")}>
                <FaSignInAlt /> Iniciar sesión
              </button>

              <button onClick={() => router.push("/register")} className={linkClasses("/register")}>
                <FaUserPlus /> Registrarse
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirm && (
        <ConfirmModal
          message="¿Deseas cerrar sesión?"
          onConfirm={confirmLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </header>
  );
}
