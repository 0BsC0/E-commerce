import axios from "./axiosInstance";

//Iniciar sesión → { token, user }
export const login = async (credentials) => {
  try {
    const res = await axios.post("/auth/login", credentials);
    return res.data; // { token, user }
  } catch (error) {
    const msg = error.response?.data?.error || "Error al iniciar sesión";
    throw new Error(msg);
  }
};

//Registrar nuevo usuario → { message }
export const register = async (data) => {
  try {
    const res = await axios.post("/auth/register", data);
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || "Error al registrar usuario";
    throw new Error(msg);
  }
};

//Cerrar sesión localmente (por si lo usas desde aquí)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
