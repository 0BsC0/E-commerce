import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useToastContext } from "@/context/ToastContext";
import {
  getMyOrders as getViveristaOrders,
  updateOrderStatus
} from "@/services/orderService";

const statusMap = {
  PENDING: "Pendiente",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const reverseStatusMap = {
  Pendiente: "PENDING",
  Enviado: "SHIPPED",
  Entregado: "DELIVERED",
  Cancelado: "CANCELLED",
};

export const useOrders = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToastContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getViveristaOrders(user.token);
      setOrders(res);
    } catch (err) {
      console.error("❌ Error al cargar órdenes:", err);
      showToast("error", err.message || "Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatusLabel) => {
    const backendStatus = reverseStatusMap[newStatusLabel];
    try {
      await updateOrderStatus(id, backendStatus, user.token);
      showToast("success", "✅ Estado de la orden actualizado");
      await loadOrders();
    } catch (err) {
      console.error(err);
      showToast("error", "No se pudo actualizar la orden");
    }
  };

  const handleDeleteOrderView = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  useEffect(() => {
    if (user?.role === "viverista") loadOrders();
  }, [user]);

  return {
    orders,
    loading,
    statusMap,
    handleStatusChange,
    handleDeleteOrderView
  };
};
