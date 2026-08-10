import axiosInstance from './axiosInstance';

export const createOrder = (data) => axiosInstance.post('/orders', data);
export const getMyOrders = () => axiosInstance.get('/orders/my-orders');
export const getOrderById = (id) => axiosInstance.get(`/orders/${id}`);
export const getAllOrders = (status) =>
  axiosInstance.get('/orders', { params: status ? { status } : {} });
export const updateOrderStatus = (id, status) =>
  axiosInstance.put(`/orders/${id}/status`, { status });