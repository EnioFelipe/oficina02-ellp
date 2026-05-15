import { api } from './api';

export const usersService = {
  list: (params = {}) => {
    const query = Object.fromEntries(Object.entries(params).filter(([, value]) => value));
    return api.get('/users', { params: query }).then((res) => res.data);
  },
  get: (id) => api.get(`/users/${id}`).then((res) => res.data),
  create: (data) => api.post('/users', data).then((res) => res.data),
  update: (id, data) => api.put(`/users/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/users/${id}`)
};
