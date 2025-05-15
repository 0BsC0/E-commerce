import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCartContext } from "@/context/CartContext";
import { useToastContext } from "@/context/ToastContext";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const { clearCart } = useCartContext();
  const { showToast } = useToastContext();

  useEffect(() => {
    // Limpiar carrito solo si hay una orden válida
    if (orderId) {
      clearCart();
      showToast("success", "✅ Pedido confirmado exitosamente");
    }

    const timer = setTimeout(() => {
      router.push("/mis-pedidos");
    }, 5000);

    return () => clearTimeout(timer);
  }, [orderId]);

  return (
    <DashboardLayout>
      <section className="max-w-2xl mx-auto p-6 mt-10 text-center bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">✅ ¡Pago exitoso!</h1>
        <p className="text-gray-700 text-lg mb-2">
          Tu pedido ha sido registrado correctamente.
        </p>

        {orderId ? (
          <p className="text-gray-500">
            Número de orden: <span className="font-semibold">{orderId}</span>
          </p>
        ) : (
          <p className="text-red-500 text-sm mt-2">No se encontró número de orden.</p>
        )}

        <p className="text-gray-600 mt-4">
          Serás redirigido automáticamente a <strong>Mis Pedidos</strong> en unos segundos...
        </p>
      </section>
    </DashboardLayout>
  );
}
