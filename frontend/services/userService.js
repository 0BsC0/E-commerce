import axiosInstance from './axiosInstance';

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};
