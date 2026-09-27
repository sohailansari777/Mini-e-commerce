import apiClient from './apiClient';

export const authService = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh-token');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/me', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.put('/auth/me/password', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/auth/me');
    return response.data;
  }
};

export default authService;
