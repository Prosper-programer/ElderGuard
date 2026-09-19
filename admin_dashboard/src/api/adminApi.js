import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('elderguard_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 unauthorized errors (e.g. revoked or expired admin token)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('elderguard_admin_token');
      localStorage.removeItem('elderguard_admin_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Admin Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/admin-login', { email, password });
    return response.data;
  },

  // Retrieve Aggregate Platform Health Stats (Parents, Elderly, Devices)
  getSystemStats: async () => {
    const response = await apiClient.get('/admin/system-stats');
    return response.data.data;
  },

  // Retrieve Paginated / Filtered Parents
  getParents: async (params = {}) => {
    const response = await apiClient.get('/admin/parents', { params });
    return response.data;
  },

  // Retrieve Single Parent Details
  getParentById: async (id) => {
    const response = await apiClient.get(`/admin/parents/${id}`);
    return response.data.data;
  },

  // Activate Parent Account
  activateParent: async (id) => {
    const response = await apiClient.put(`/admin/parents/${id}/activate`);
    return response.data;
  },

  // Deactivate Parent Account (immediately revoking active sessions)
  deactivateParent: async (id) => {
    const response = await apiClient.put(`/admin/parents/${id}/deactivate`);
    return response.data;
  },
};
