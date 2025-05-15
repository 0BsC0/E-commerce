import { useCartContext } from "@/context/CartContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FaTrash } from "react-icons/fa";

export default function CarritoPage() {
  const {
    cartItems,
    cartItemCount,
    loadingCart,
    removeFromCart,
    clearCart,
  } = useCartContext();
  const router = useRouter();

  useEffect(() => {
    // Si necesitas lógica futura cuando cambie el carrito, este useEffect queda útil
  }, [cartItems, loadingCart]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <DashboardLayout>
      <section className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🛒 Mi Carrito <span className="text-base text-gray-500">({cartItemCount})</span>
        </h1>

        {loadingCart ? (
          <LoadingSpinner text="Cargando carrito..." />
        ) : cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Tu carrito está vacío por ahora.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {item.product.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        ${item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Categoría: {item.product.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Eliminar del carrito"
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Total y acciones */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xl font-bold text-green-800">
                Total: ${total.toFixed(2)}
              </p>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={clearCart}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
                >
                  Vaciar carrito
                </button>
                <button
                  onClick={() => router.push("/checkout")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Pagar ahora
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
