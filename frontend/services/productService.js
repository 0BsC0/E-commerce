import axiosInstance from "./axiosInstance";

// Crear un nuevo producto (solo para viveristas autenticados)
export const createProduct = async (productData, token) => {
  try {
    const res = await axiosInstance.post("/products", productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error al crear el producto");
  }
};

// Obtener todos los productos públicos
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/products${params ? `?${params}` : ''}`);
    return res.data;
  } catch (error) {
    throw new Error("Error al obtener productos públicos");
  }
};


// Obtener productos del viverista autenticado
export const getProductsByUser = async (token) => {
  try {
    const res = await axiosInstance.get("/products/my-products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("Error al obtener productos del viverista");
  }
};

// Eliminar producto por ID (si es del usuario autenticado)
export const deleteProduct = async (productId, token) => {
  try {
    const res = await axiosInstance.delete(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error al eliminar el producto");
  }
};

// Actualizar un producto existente
export const updateProduct = async (productId, updatedData, token) => {
  try {
    const res = await axiosInstance.put(`/products/${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error al actualizar el producto");
  }
};

// Obtener productos destacados (más vendidos o recientes)
export const getFeaturedProducts = async () => {
  const res = await axiosInstance.get("/products/featured");
  return res.data;
};

// Obtener productos por categoria
export const getCategories = async () => {
  const res = await axiosInstance.get("/products/categories");
  return res.data;
};
