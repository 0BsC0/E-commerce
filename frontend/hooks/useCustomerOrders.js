import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useToastContext } from "@/context/ToastContext";
import { getMyOrders } from "@/services/orderService";

// Traducción de estados de orden
const statusMap = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const useCustomerOrders = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToastContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await getMyOrders(user.token);
      setOrders(res);
    } catch (err) {
      console.error("❌ Error al cargar pedidos del cliente:", err);
      showToast("error", err.message || "Error al cargar tus pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "customer" && user?.token) {
      loadOrders();
    }
  }, [user]);

  return {
    orders,
    loading,
    statusMap,
  };
};
