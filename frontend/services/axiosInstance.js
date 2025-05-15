import axios from "axios";

// Config base
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitud: agrega token desde sessionStorage
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: detecta errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.error || error?.message || "";
    const status = error?.response?.status;

    if (
      status === 401 ||
      status === 403 ||
      message.toLowerCase().includes("token") ||
      message.toLowerCase().includes("jwt")
    ) {
      console.warn("🔒 Token inválido o expirado. Redireccionando...");
      sessionStorage.clear();
      window.location.href = "/"; // redirige al inicio o login
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
