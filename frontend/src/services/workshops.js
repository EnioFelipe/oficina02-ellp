import { api } from './api';

export const workshopsService = {
  list: (params) => api.get('/workshops', { params }).then((res) => res.data),
  get: (id) => api.get(`/workshops/${id}`).then((res) => res.data),
  create: (data) => api.post('/workshops', data).then((res) => res.data),
  update: (id, data) => api.put(`/workshops/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/workshops/${id}`),
  addTutor: (id, participantId) => api.post(`/workshops/${id}/tutors`, { participantId }).then((res) => res.data),
  removeTutor: (id, tutorId) => api.delete(`/workshops/${id}/tutors/${tutorId}`).then((res) => res.data)
};
