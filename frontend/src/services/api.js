import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const assetUrl = (path) => {
  if (!path) return '';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiUrl.replace(/\/api\/?$/, '')}${path}`;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Erro inesperado na API';
    console.error(message);
    if (error.response?.status !== 401) toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
