import axiosInstance from './axiosInstance';

// Obtener perfil por ID
export const getUserProfile = async (id) => {
  const response = await axiosInstance.get(`/users/profile/${id}`);
  return response.data;
};

// Actualizar perfil
export const updateUserProfile = async (id, profileData) => {
  const response = await axiosInstance.put(`/users/profile/${id}`, profileData);
  return response.data;
};
