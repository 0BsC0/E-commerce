import axiosInstance from './axiosInstance';

// ✅ Crear un nuevo producto
export const createProduct = async (productData, token) => {
  const res = await axiosInstance.post('/', productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Obtener todos los productos públicos
export const getProducts = async () => {
  const res = await axiosInstance.get('/');
  return res.data;
};

// ✅ Obtener productos creados por un viverista autenticado
export const getProductsByUser = async (userId, token) => {
  const res = await axiosInstance.get(`/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Eliminar producto (requiere token y verificación en backend)
export const deleteProduct = async (productId, token) => {
  const res = await axiosInstance.delete(`/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
