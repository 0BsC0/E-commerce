import axiosInstance from "./axiosInstance";

// Obtener perfil del usuario autenticado 
export const getUserProfile = async (token) => {
  const response = await axiosInstance.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Actualizar perfil del usuario autenticado 
export const updateUserProfile = async (profileData, token) => {
  const payload = {
    name: profileData.name,
    lastName: profileData.lastName,
    address: profileData.address,
    phone: profileData.phone,
    storeName: profileData.storeName,
    role: profileData.role,
    newEmail: profileData.newEmail,
    newPassword: profileData.newPassword,
    confirmNewPassword: profileData.confirmNewPassword,
  };

  const response = await axiosInstance.put("/users/me", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
