import axiosInstance from "./axiosInstance";

// Agregar producto al carrito
export const addToCart = async (productId, quantity, token) => {
  try {
    const response = await axiosInstance.post(
      "/cart/add",
      { productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error; // será manejado por handleTokenError
  }
};

// Obtener los ítems del carrito del usuario autenticado
export const getCart = async (token) => {
  try {
    const response = await axiosInstance.get("/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un ítem específico del carrito
export const removeFromCart = async (itemId, token) => {
  try {
    const response = await axiosInstance.delete(`/cart/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Vaciar el carrito completo
export const clearCart = async (token) => {
  try {
    const response = await axiosInstance.delete("/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
