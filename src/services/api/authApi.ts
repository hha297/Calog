import apiClient from './client';
import {
  SignupRequest,
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  AuthResponse,
  RefreshTokenResponse,
  User,
} from '../../types';

// Authentication API functions
export const authApi = {
  // Sign up a new user
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/signup', data);
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  // Refresh access token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
  },

  // Logout user
  logout: async (data: LogoutRequest): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/logout', data);
  },

  // Get current user info
  getCurrentUser: async (): Promise<{ user: User }> => {
    return apiClient.get<{ user: User }>('/auth/me');
  },
};

// Export individual functions for convenience
export const {
  signup,
  login,
  refreshToken,
  logout,
  getCurrentUser,
} = authApi;
