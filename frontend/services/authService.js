import axios from './axiosInstance';
export const login = async (credentials) => (await axios.post('/auth/login', credentials)).data;
export const register = async (data) => (await axios.post('/auth/register', data)).data;
