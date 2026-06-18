import axios from 'axios';
import { auth } from '../config/firebase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function errorMessage(error) {
  return error.response?.data?.message || 'Nao foi possivel concluir a operacao';
}
