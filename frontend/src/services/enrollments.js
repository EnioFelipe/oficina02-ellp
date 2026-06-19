import { api } from './api';

export const enrollmentsService = {
  create: (data) => api.post('/enrollments', data).then((res) => res.data),
  findByCpf: (cpf) => api.get(`/enrollments/cpf/${cpf}`).then((res) => res.data),
  listByWorkshop: (workshopId) => api.get(`/enrollments/workshop/${workshopId}`).then((res) => res.data)
};
