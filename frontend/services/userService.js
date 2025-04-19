import axiosInstance from './axiosInstance';

// ✅ Obtener perfil por ID (requiere token JWT)
export const getUserProfile = async (id, token) => {
  const response = await axiosInstance.get(`/users/profile/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Actualizar perfil (requiere token JWT)
export const updateUserProfile = async (id, profileData, token) => {
  const response = await axiosInstance.put(`/users/profile/${id}`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
