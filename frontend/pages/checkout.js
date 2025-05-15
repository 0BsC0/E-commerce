import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { useToastContext } from "@/context/ToastContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CheckoutPage() {
  const { user } = useContext(AuthContext);
  const { cartItems } = useCartContext();
  const { showToast } = useToastContext();

  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (!user?.token) {
      showToast("error", "Debes iniciar sesión para completar la compra.");
      return;
    }

    if (cartItems.length === 0) {
      showToast("error", "Tu carrito está vacío.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        showToast("error", "No se pudo iniciar el pago.");
      }
    } catch (err) {
      console.error("❌ Error al iniciar pago:", err);
      showToast("error", "Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl border">
        <h1 className="text-3xl font-bold text-green-700 mb-6">🧾 Confirmar Pedido</h1>

        {loading ? (
          <LoadingSpinner text="Redirigiendo al pago..." />
        ) : cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-6">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex justify-between text-sm text-gray-700"
                >
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center border-t pt-4">
              <p className="font-semibold text-gray-700">Total:</p>
              <p className="text-lg font-bold text-green-700">
                ${total.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`mt-6 w-full py-2 px-4 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Procesando..." : "Pagar ahora con Mercado Pago"}
            </button>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
