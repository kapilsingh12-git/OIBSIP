import axiosInstance from './axiosInstance';

export const registerUser = (data) => axiosInstance.post('/auth/register', data);
export const loginUser = (data) => axiosInstance.post('/auth/login', data);
export const verifyEmail = (token) => axiosInstance.get(`/auth/verify-email/${token}`);
export const forgotPassword = (data) => axiosInstance.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => axiosInstance.post(`/auth/reset-password/${token}`, data);
export const getProfile = () => axiosInstance.get('/auth/profile');
export const updateProfile = (data) => axiosInstance.put('/auth/profile', data);