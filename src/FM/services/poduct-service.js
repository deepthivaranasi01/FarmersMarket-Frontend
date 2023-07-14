import axios from "axios";

const SERVER_API_URL = process.env.REACT_APP_API_BASE;
const PRODUCTS_URL = `${SERVER_API_URL}/products`;

const api = axios.create({ withCredentials: true });

export const createProduct = async (product) => {
  const response = await api.post(`${PRODUCTS_URL}`, product);
  return response.data;
};

export const getProduct = async (foodId) => {
  const response = await api.get(`${PRODUCTS_URL}/${foodId}`);
  return response.data;
};

export const updateProduct = async (foodId, product) => {
  const response = await api.put(`${PRODUCTS_URL}/${foodId}`, product);
  return response.data;
};

export const deleteProduct = async (foodId) => {
  const response = await api.delete(`${PRODUCTS_URL}/${foodId}`);
  return response.data;
};
export const addReviewToProduct = async (foodId, review) => {
  const response = await api.post(`${PRODUCTS_URL}/${foodId}/reviews`, review);
  return response.data;
};