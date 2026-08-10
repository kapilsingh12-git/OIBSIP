import axiosInstance from './axiosInstance';

export const createRazorpayOrder = (orderId) =>
  axiosInstance.post('/payments/create-order', { orderId });

export const verifyPayment = (data) => axiosInstance.post('/payments/verify', data);