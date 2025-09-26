import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, AuthTokens } from '../types';
import { authApi } from '../services/api/authApi';
import { secureStorage } from '../services/secureStorage';
import { onboardingStorage } from '../services/onboardingStorage';
import apiClient from '../services/api/client';

// Create auth store
export const useAuthStore = create<AuthState>()(
        persist(
                (set, get) => ({
                        // Initial state
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,

                        // Setup unauthorized callback for API client
                        setupUnauthorizedCallback: () => {
                                apiClient.setUnauthorizedCallback(() => {
                                        // Auto-logout when token is invalid
                                        get().logout();
                                });
                        },

                        // Actions
                        login: async (tokens: AuthTokens, user: User, rememberMe = false) => {
                                try {
                                        set({ isLoading: true, error: null });

                                        // Set tokens in API client
                                        apiClient.setAccessToken(tokens.accessToken);

                                        // Store refresh token securely if rememberMe is true
                                        if (rememberMe && tokens.refreshToken) {
                                                await secureStorage.storeRefreshToken(tokens.refreshToken);
                                                await secureStorage.storeUserData(user);
                                        }

                                        // Update state
                                        set({
                                                user,
                                                accessToken: tokens.accessToken,
                                                refreshToken: tokens.refreshToken || null,
                                                isAuthenticated: true,
                                                isLoading: false,
                                        });
                                } catch (error) {
                                        console.error('Login error:', error);
                                        set({
                                                error: error instanceof Error ? error.message : 'Login failed',
                                                isLoading: false,
                                        });
                                        throw error;
                                }
                        },

                        logout: async () => {
                                try {
                                        set({ isLoading: true });

                                        const { refreshToken } = get();

                                        // Call logout API if we have a refresh token
                                        if (refreshToken) {
                                                try {
                                                        await authApi.logout({ refreshToken });
                                                } catch (error) {
                                                        // Continue with logout even if API call fails
                                                        console.warn('Logout API call failed:', error);
                                                }
                                        }

                                        // Clear secure storage
                                        await secureStorage.clearAll();

                                        // Clear onboarding data
                                        await onboardingStorage.resetOnboarding();

                                        // Clear API client token
                                        apiClient.setAccessToken(null);

                                        // Reset state
                                        set({
                                                user: null,
                                                accessToken: null,
                                                refreshToken: null,
                                                isAuthenticated: false,
                                                isLoading: false,
                                                error: null,
                                        });
                                } catch (error) {
                                        console.error('Logout error:', error);
                                        set({
                                                error: error instanceof Error ? error.message : 'Logout failed',
                                                isLoading: false,
                                        });
                                        throw error;
                                }
                        },

                        refresh: async () => {
                                try {
                                        const { refreshToken } = get();

                                        if (!refreshToken) {
                                                throw new Error('No refresh token available');
                                        }

                                        set({ isLoading: true, error: null });

                                        // Call refresh API
                                        const response = await authApi.refreshToken({ refreshToken });

                                        // Update tokens in API client
                                        apiClient.setAccessToken(response.accessToken);

                                        // Store new refresh token securely
                                        await secureStorage.storeRefreshToken(response.refreshToken);

                                        // Update state
                                        set({
                                                accessToken: response.accessToken,
                                                refreshToken: response.refreshToken,
                                                isLoading: false,
                                        });

                                        return true;
                                } catch (error) {
                                        console.error('Token refresh error:', error);

                                        // If refresh fails, logout user
                                        await get().logout();

                                        set({
                                                error: error instanceof Error ? error.message : 'Token refresh failed',
                                                isLoading: false,
                                        });

                                        return false;
                                }
                        },

                        setUser: (user: User) => {
                                set({ user });
                        },

                        setTokens: (tokens: AuthTokens) => {
                                apiClient.setAccessToken(tokens.accessToken);
                                set({
                                        accessToken: tokens.accessToken,
                                        refreshToken: tokens.refreshToken || null,
                                        isAuthenticated: true,
                                });
                        },

                        clearError: () => {
                                set({ error: null });
                        },

                        setLoading: (loading: boolean) => {
                                set({ isLoading: loading });
                        },
                }),
                {
                        name: 'auth-storage',
                        storage: createJSONStorage(() => AsyncStorage),
                        // Only persist non-sensitive data
                        partialize: (state) => ({
                                user: state.user,
                                isAuthenticated: state.isAuthenticated,
                        }),
                },
        ),
);

// Initialize auth state on app start
export const initializeAuth = async () => {
        try {
                const { setTokens, setUser, setLoading } = useAuthStore.getState();

                setLoading(true);

                // Try to get refresh token from secure storage
                const refreshToken = await secureStorage.getRefreshToken();

                if (refreshToken) {
                        // Try to refresh tokens
                        const response = await authApi.refreshToken({ refreshToken });

                        // Get user data
                        const userData = await secureStorage.getUserData();

                        if (userData) {
                                // Set tokens and user
                                setTokens({
                                        accessToken: response.accessToken,
                                        refreshToken: response.refreshToken,
                                });
                                setUser(userData);
                        } else {
                                // If no user data, fetch from API
                                const userResponse = await authApi.getCurrentUser();
                                setUser(userResponse.user);
                                await secureStorage.storeUserData(userResponse.user);
                        }
                }
        } catch (error) {
                console.error('Auth initialization error:', error);
                // Clear any invalid tokens
                await secureStorage.clearAll();
                // Clear onboarding data on auth error
                await onboardingStorage.resetOnboarding();
        } finally {
                useAuthStore.getState().setLoading(false);
        }
};
