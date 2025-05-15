import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Toast({ type = "success", message = "", onClose }) {
  const isError = type === "error";
  const Icon = isError ? FaExclamationTriangle : FaCheckCircle;

  const [visible, setVisible] = useState(true);

  const bgColor = isError ? "bg-red-50/90" : "bg-green-50/90";
  const borderColor = isError ? "border-red-300" : "border-green-300";
  const textColor = isError ? "text-red-800" : "text-green-800";
  const iconColor = isError ? "text-red-600" : "text-green-600";
  const closeColor = isError
    ? "text-red-500 hover:text-red-700"
    : "text-green-500 hover:text-green-700";

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // tiempo para animación fade-out
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-[9999]
        w-[90%] sm:w-[400px] px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md
        flex items-center justify-between gap-3 transition-all duration-300
        ${bgColor} ${borderColor} ${textColor}
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"}
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className={`${iconColor} text-xl`} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          aria-label="Cerrar notificación"
          className={`${closeColor} text-xl font-bold`}
        >
          &times;
        </button>
      )}
    </div>
  );
}
