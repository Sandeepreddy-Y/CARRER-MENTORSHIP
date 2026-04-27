import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (userData) => apiClient.put('/auth/profile', userData)
};

export const careerResourceAPI = {
  getAllResources: (params) => apiClient.get('/resources', { params }),
  getResourceById: (id) => apiClient.get(`/resources/${id}`),
  getResourcesByCategory: (category) => apiClient.get(`/resources/category/${category}`),
  createResource: (data) => apiClient.post('/resources', data),
  updateResource: (id, data) => apiClient.put(`/resources/${id}`, data),
  deleteResource: (id) => apiClient.delete(`/resources/${id}`)
};

export const sessionAPI = {
  scheduleSession: (data) => apiClient.post('/sessions', data),
  getUserSessions: () => apiClient.get('/sessions'),
  getSessionById: (id) => apiClient.get(`/sessions/${id}`),
  updateSessionStatus: (id, data) => apiClient.put(`/sessions/${id}`, data),
  cancelSession: (id) => apiClient.delete(`/sessions/${id}`),
  getAvailableCounsellors: () => apiClient.get('/sessions/counsellors/available')
};

export const adminAPI = {
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  getDashboardStats: () => apiClient.get('/admin/stats/dashboard'),
  getEngagementStats: (params) => apiClient.get('/admin/stats/engagement', { params }),
  getUserProfile: (userId) => apiClient.get(`/admin/users/${userId}`),
  connectStudentWithCounsellor: (data) => apiClient.post('/admin/connect', data),
  deactivateUser: (userId) => apiClient.put(`/admin/users/${userId}/deactivate`)
};

export default apiClient;
