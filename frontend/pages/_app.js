import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
