import { useEffect } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  // Bloquear scroll de fondo
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black bg-opacity-40"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute top-20 left-1/2 -translate-x-1/2
        bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200 animate-fade-in"
      >
        {/* Botón de cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          aria-label="Cerrar modal"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Icono y mensaje */}
        <div className="flex flex-col items-center text-center">
          <FaExclamationTriangle className="text-yellow-500 text-3xl mb-3" />
          <p className="text-gray-800 font-medium mb-6">{message}</p>

          {/* Botones */}
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={onCancel}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
