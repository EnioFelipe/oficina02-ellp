import { api } from './api';

export const reportsService = {
  dashboard: () => api.get('/reports/dashboard').then((res) => res.data),
  participants: () => api.get('/reports/workshop-participants').then((res) => res.data),
  history: () => api.get('/reports/workshop-history').then((res) => res.data)
};
