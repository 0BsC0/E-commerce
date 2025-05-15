import axiosInstance from "./axiosInstance";

// Crear una nueva orden desde el carrito (con paymentId opcional)
export const createOrderFromCart = async (token, paymentId = null) => {
  const payload = paymentId ? { paymentId } : {};
  const res = await axiosInstance.post("/orders", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Obtener todas las órdenes del usuario autenticado
export const getMyOrders = async (token) => {
  const res = await axiosInstance.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Ver detalle de una orden
export const getOrderById = async (id, token) => {
  const res = await axiosInstance.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Cambiar estado de una orden (solo viverista o admin)
export const updateOrderStatus = async (id, status, token) => {
  const res = await axiosInstance.put(
    `/orders/${id}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
