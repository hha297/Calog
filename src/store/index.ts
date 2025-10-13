import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, AuthTokens, User } from '../types';
import { authApi } from '../services/api/authApi';
import { secureStorage } from '../services/secureStorage';
import { onboardingStorage } from '../services/onboardingStorage';
import apiClient from '../services/api/client';

export const useAuthStore = create<AuthState>()(
        persist(
                (set, get) => ({
                        // ===== State =====
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isInitializing: true,
                        error: null,

                        // ===== Actions =====
                        login: async (tokens: AuthTokens, user: User, rememberMe = false) => {
                                try {
                                        set({ isLoading: true, error: null });

                                        // Set token cho apiClient
                                        apiClient.setAccessToken(tokens.accessToken);

                                        // Store refresh token + user in secureStorage
                                        if (tokens.refreshToken) {
                                                await secureStorage.storeRefreshToken(tokens.refreshToken);
                                                await secureStorage.storeUserData(user);
                                        }

                                        set({
                                                user,
                                                accessToken: tokens.accessToken,
                                                refreshToken: tokens.refreshToken || null,
                                                isAuthenticated: true,
                                                isLoading: false,
                                        });
                                } catch (err) {
                                        set({
                                                error: err instanceof Error ? err.message : 'Login failed',
                                                isLoading: false,
                                        });
                                        throw err;
                                }
                        },

                        logout: async () => {
                                try {
                                        set({ isLoading: true });

                                        const refreshToken = get().refreshToken;
                                        if (refreshToken) {
                                                try {
                                                        await authApi.logout({ refreshToken });
                                                } catch (err) {}
                                        }

                                        await secureStorage.clearAll();
                                        await onboardingStorage.resetOnboarding();
                                        apiClient.setAccessToken(null);

                                        set({
                                                user: null,
                                                accessToken: null,
                                                refreshToken: null,
                                                isAuthenticated: false,
                                                isLoading: false,
                                                error: null,
                                        });
                                } catch (err) {
                                        set({
                                                error: err instanceof Error ? err.message : 'Logout failed',
                                                isLoading: false,
                                        });
                                        throw err;
                                }
                        },

                        refresh: async () => {
                                try {
                                        // refreshToken from secureStorage, not rolling
                                        const refreshToken = await secureStorage.getRefreshToken();
                                        if (!refreshToken) throw new Error('No refresh token');

                                        const res = await authApi.refreshToken({ refreshToken });

                                        apiClient.setAccessToken(res.accessToken);

                                        set({
                                                accessToken: res.accessToken,
                                                refreshToken, // keep old refreshToken
                                                isAuthenticated: true,
                                        });

                                        return true;
                                } catch (err) {
                                        await get().logout();
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

                        clearError: () => set({ error: null }),
                        setLoading: (loading: boolean) => set({ isLoading: loading }),
                        setInitializing: (initializing: boolean) => set({ isInitializing: initializing }),

                        setupUnauthorizedCallback: () => {
                                apiClient.setUnauthorizedCallback(() => {
                                        get().logout();
                                });
                        },
                }),
                {
                        name: 'auth-storage',
                        storage: createJSONStorage(() => AsyncStorage),
                        partialize: (state) => ({
                                user: state.user,
                                isAuthenticated: state.isAuthenticated,
                        }),
                },
        ),
);

// ===== App start init =====
export const initializeAuth = async () => {
        const { refresh, setUser, setInitializing } = useAuthStore.getState();

        try {
                const ok = await refresh();
                if (ok) {
                        const userData = await secureStorage.getUserData();
                        if (userData) {
                                setUser(userData);
                        } else {
                                const { getCurrentUser } = await import('../services/api/authApi');
                                const res = await getCurrentUser();
                                setUser(res.user);
                                try {
                                        await secureStorage.storeUserData(res.user);
                                } catch (storageError) {
                                        // Ignore storage errors during init
                                        console.error('Error storing user data:', storageError);
                                }
                        }
                }
        } finally {
                setInitializing(false);
        }
};
