import axiosInstance from './axiosInstance';

export const getInventory = () => axiosInstance.get('/inventory');
export const addInventoryItem = (data) => axiosInstance.post('/inventory', data);
export const updateInventoryItem = (id, data) => axiosInstance.put(`/inventory/${id}`, data);
export const deleteInventoryItem = (id) => axiosInstance.delete(`/inventory/${id}`);