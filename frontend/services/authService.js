import axios from './axiosInstance';

// Iniciar sesión (login)
export const login = async (credentials) => {
  const res = await axios.post('/auth/login', credentials);
  return res.data;
};

// Registrar usuario (cliente o viverista)
export const register = async (data) => {
  const res = await axios.post('/auth/register', data);
  return res.data;
};
