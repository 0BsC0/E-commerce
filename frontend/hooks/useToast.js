import { useState, useRef } from "react";

/**
 * Hook personalizado para mostrar toasts temporales
 * @param {number} duration 
 */
export default function useToast(duration = 4000) {
  const [toast, setToast] = useState({ type: "", message: "" });
  const timeoutRef = useRef(null);

  const showToast = (type, message) => {
    clearTimeout(timeoutRef.current);
    setToast({ type, message });

    timeoutRef.current = setTimeout(() => {
      setToast({ type: "", message: "" });
    }, duration + 300); // +300 para dejar terminar animación fade-out
  };

  const closeToast = () => {
    clearTimeout(timeoutRef.current);
    setToast({ type: "", message: "" });
  };

  return { toast, showToast, closeToast };
}
