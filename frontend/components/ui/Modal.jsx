import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function Modal({ isOpen, onClose, title, children }) {
  // Evitar scroll en el fondo cuando el modal está activo
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup al desmontar el modal
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black bg-opacity-40"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute top-5 left-1/2 -translate-x-1/2
        bg-white rounded-2xl shadow-2xl w-[90%] max-w-xl border border-gray-200 animate-fade-in
        max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          aria-label="Cerrar modal"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Título */}
        {title && (
          <div className="px-6 pt-6 pb-0">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
              {title}
            </h2>
          </div>
        )}

        {/* Contenido */}
        <div className="px-6 pb-6 pt-2 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
