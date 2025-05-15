import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CustomerOrdersView({ orders, loading, statusMap }) {
  const statusColors = {
    Pendiente: "bg-yellow-100 text-yellow-700",
    Pagado: "bg-green-100 text-green-700",
    Enviado: "bg-blue-100 text-blue-700",
    Entregado: "bg-green-200 text-green-800",
    Cancelado: "bg-red-100 text-red-700",
  };

  return (
    <section className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-700 mb-6">📦 Mis Pedidos</h1>

      {loading ? (
        <LoadingSpinner text="Cargando tus pedidos..." />
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">
          Aún no has realizado ningún pedido.
        </p>
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => {
            const rawStatus = order.status;
            const statusLabel = statusMap[rawStatus] || rawStatus;
            const statusClass =
              statusColors[statusLabel] || "bg-gray-100 text-gray-700";

            return (
              <li
                key={order.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-gray-800">
                    Pedido #{order.id}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-1">
                  Total pagado:{" "}
                  <span className="font-bold text-green-800">
                    ${order.total.toFixed(2)}
                  </span>
                </p>

                {order.paymentId && (
                  <p className="text-sm text-gray-600 mb-2">
                    Referencia de pago:{" "}
                    <span className="font-mono">{order.paymentId}</span>
                  </p>
                )}

                <ul className="pl-4 text-sm text-gray-600 mb-3 list-disc">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product?.name || "Producto"} (x{item.quantity}) - ${" "}
                      {(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>

                <div
                  className={`inline-block px-3 py-1 text-sm font-medium rounded ${statusClass}`}
                >
                  Estado: {statusLabel}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
