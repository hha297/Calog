import apiClient from './client';
import { GoogleSigninService } from '../googleSigninService';
import {
        SignupRequest,
        LoginRequest,
        RefreshTokenRequest,
        LogoutRequest,
        AuthResponse,
        RefreshTokenResponse,
        User,
        AuthTokens,
} from '../../types';

// Authentication API functions
export const authApi = {
        // Sign up a new user
        signup: async (data: SignupRequest): Promise<AuthResponse> => {
                const response = await apiClient.post<AuthResponse>('/auth/signup', data);
                return response;
        },

        // Login user
        login: async (data: LoginRequest): Promise<AuthResponse> => {
                const response = await apiClient.post<AuthResponse>('/auth/login', data);
                return response;
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
                const response = await apiClient.get<{ user: User }>('/auth/me');
                return response;
        },

        // Google OAuth - Sign in with Google
        googleSignIn: async (): Promise<AuthResponse> => {
                try {
                        // Initialize Google Sign-In if not already done
                        await GoogleSigninService.initialize();

                        // Sign in with Google
                        const { user, tokens } = await GoogleSigninService.signIn();

                        // Send Google tokens to server for verification and user creation/login
                        const response = await apiClient.post<AuthResponse>('/auth/google', {
                                idToken: tokens.idToken,
                                accessToken: tokens.accessToken,
                                user: {
                                        id: user.id || user._id,
                                        email: user.email,
                                        name: user.name,
                                        avatar: user.avatar,
                                },
                        });

                        return response;
                } catch (error) {
                        throw new Error('Google authentication failed');
                }
        },

        // Google OAuth - Sign out from Google
        googleSignOut: async (): Promise<void> => {
                try {
                        await GoogleSigninService.signOut();
                } catch (error) {
                        throw error;
                }
        },
};

// Export individual functions for convenience
export const { signup, login, refreshToken, logout, getCurrentUser, googleSignIn, googleSignOut } = authApi;
