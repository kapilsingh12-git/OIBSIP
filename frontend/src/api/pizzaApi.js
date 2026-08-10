import axiosInstance from './axiosInstance';

export const getPizzas = (category) =>
  axiosInstance.get('/pizzas', { params: category ? { category } : {} });

export const getPizzaById = (id) => axiosInstance.get(`/pizzas/${id}`);

export const getPizzaOptions = () => axiosInstance.get('/pizzas/options');

export const createPizza = (formData) =>
  axiosInstance.post('/pizzas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updatePizza = (id, formData) =>
  axiosInstance.put(`/pizzas/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletePizza = (id) => axiosInstance.delete(`/pizzas/${id}`);
