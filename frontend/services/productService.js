import axiosInstance from './axiosInstance';

// Crear un nuevo producto asociado al viverista autenticado
export const createProduct = async (productData, token) => {
  const res = await axiosInstance.post('/products', productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Obtener todos los productos públicos
export const getProducts = async () => {
  const res = await axiosInstance.get('/products');
  return res.data;
};

// Obtener productos creados por un viverista autenticado
export const getProductsByUser = async (userId, token) => {
  const res = await axiosInstance.get(`/products/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Eliminar producto por ID (solo si es del viverista autenticado)
export const deleteProduct = async (productId, token) => {
  const res = await axiosInstance.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
