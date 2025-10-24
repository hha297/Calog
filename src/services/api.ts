import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
};

export const notificationService = {
  initialize: () => {
    // OneSignal initialization will be handled in App.tsx
  },
  sendNotification: async (title: string, message: string) => {
    // OneSignal notification logic
  },
};
