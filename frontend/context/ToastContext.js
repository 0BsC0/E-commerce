import { createContext, useContext } from "react";
import useToast from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const { toast, showToast, closeToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Posicionamiento exacto del toast sin bloquear la interfaz */}
      {toast.message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={closeToast}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
};

// Hook reutilizable
export const useToastContext = () => useContext(ToastContext);
