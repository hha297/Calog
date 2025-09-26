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
                        console.error('Google Sign-Out error:', error);
                        throw error;
                }
        },
};

// Export individual functions for convenience
export const { signup, login, refreshToken, logout, getCurrentUser, googleSignIn, googleSignOut } = authApi;
