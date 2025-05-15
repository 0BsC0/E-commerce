import { useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { FaTrashAlt } from "react-icons/fa";

export default function OrdersView({ orders, loading, statusMap, onStatusChange, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const statusColors = {
    Pendiente: "bg-yellow-100 text-yellow-700",
    Pagado: "bg-green-100 text-green-700",
    Enviado: "bg-blue-100 text-blue-700",
    Entregado: "bg-green-200 text-green-800",
    Cancelado: "bg-red-100 text-red-700",
  };

  const openConfirm = (id) => {
    setSelectedOrderId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedOrderId) {
      onDelete(selectedOrderId);
    }
    setShowConfirm(false);
    setSelectedOrderId(null);
  };

  return (
    <section className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-700 mb-6">📋 Órdenes Recibidas</h1>

      {loading ? (
        <LoadingSpinner text="Cargando órdenes..." />
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">No has recibido órdenes aún.</p>
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => {
            const statusLabel = statusMap[order.status] || order.status;
            const statusClass = statusColors[statusLabel] || "bg-gray-100 text-gray-700";

            return (
              <li
                key={order.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-gray-800">
                    Orden #{order.id}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <p className="text-sm text-gray-700">
                  Cliente:{" "}
                  <span className="font-semibold text-green-700">
                    {order.customerName}
                  </span>
                </p>

                <p className="text-sm text-gray-700 mb-3">
                  Total:{" "}
                  <span className="font-bold text-green-800">
                    ${order.total.toFixed(2)}
                  </span>
                </p>

                <ul className="pl-4 text-sm text-gray-600 mb-3 list-disc">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product?.name || "Producto"} (x{item.quantity}) - ${" "}
                      {(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700">Estado:</span>
                    <select
                      value={statusLabel}
                      onChange={(e) => onStatusChange(order.id, e.target.value)}
                      className={`text-sm rounded px-3 py-1 border ${statusClass}`}
                    >
                      {Object.values(statusMap).map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => openConfirm(order.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    aria-label="Eliminar orden"
                    title="Eliminar orden de la vista"
                  >
                    <FaTrashAlt className="text-lg" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {showConfirm && (
        <ConfirmModal
          message="¿Estás seguro de que deseas eliminar esta orden de tu vista?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedOrderId(null);
          }}
        />
      )}
    </section>
  );
}
