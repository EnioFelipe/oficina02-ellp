import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export function errorMessage(error) {
  return error.response?.data?.message || 'Nao foi possivel concluir a operacao';
}
