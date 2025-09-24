import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { authApi } from '../services/api/authApi';
import { useAuthStore } from '../store';
import { SignupRequest, LoginRequest, RefreshTokenRequest } from '../types';

// Query keys
export const authKeys = {
        all: ['auth'] as const,
        user: () => [...authKeys.all, 'user'] as const,
};

// Signup mutation
export const useSignupMutation = () => {
        const { login } = useAuthStore();
        const queryClient = useQueryClient();

        return useMutation({
                mutationFn: async (data: SignupRequest) => {
                        return authApi.signup(data);
                },
                onSuccess: async (response) => {
                        // Auto-login after successful signup
                        await login(
                                {
                                        accessToken: response.accessToken,
                                        refreshToken: response.refreshToken,
                                },
                                response.user,
                                true, // Remember user after signup
                        );

                        // Invalidate and refetch user data
                        queryClient.invalidateQueries({ queryKey: authKeys.user() });

                        // Show success toast
                        Toast.show({
                                type: 'success',
                                text1: 'Account Created!',
                                text2: 'Welcome to Calog!',
                                position: 'top',
                        });
                },
                onError: (error) => {
                        console.error('Signup error:', error);

                        // Show error toast
                        Toast.show({
                                type: 'error',
                                text1: 'Signup Failed',
                                text2: error instanceof Error ? error.message : 'Something went wrong',
                                position: 'top',
                        });
                },
        });
};

// Login mutation
export const useLoginMutation = () => {
        const { login } = useAuthStore();
        const queryClient = useQueryClient();

        return useMutation({
                mutationFn: async (data: LoginRequest) => {
                        return authApi.login(data);
                },
                onSuccess: async (response, variables) => {
                        // Login with rememberMe preference
                        await login(
                                {
                                        accessToken: response.accessToken,
                                        refreshToken: response.refreshToken,
                                },
                                response.user,
                                variables.rememberMe,
                        );

                        // Invalidate and refetch user data
                        queryClient.invalidateQueries({ queryKey: authKeys.user() });

                        // Show success toast
                        Toast.show({
                                type: 'success',
                                text1: 'Welcome Back!',
                                text2: `Hello ${response.user.fullName}! 👋`,
                                position: 'top',
                        });
                },
                onError: (error) => {
                        console.error('Login error:', error);

                        // Show error toast
                        Toast.show({
                                type: 'error',
                                text1: 'Login Failed',
                                text2: error instanceof Error ? error.message : 'Invalid credentials',
                                position: 'top',
                        });
                },
        });
};

// Logout mutation
export const useLogoutMutation = () => {
        const { logout } = useAuthStore();
        const queryClient = useQueryClient();

        return useMutation({
                mutationFn: async () => {
                        return logout();
                },
                onSuccess: () => {
                        // Clear all cached data
                        queryClient.clear();

                        // Show success toast
                        Toast.show({
                                type: 'success',
                                text1: 'Signed Out',
                                text2: 'See you next time! 👋',
                                position: 'top',
                        });
                },
                onError: (error) => {
                        console.error('Logout error:', error);

                        // Show error toast
                        Toast.show({
                                type: 'error',
                                text1: 'Logout Failed',
                                text2: 'Please try again',
                                position: 'top',
                        });
                },
        });
};

// Refresh token mutation
export const useRefreshTokenMutation = () => {
        const { refresh } = useAuthStore();

        return useMutation({
                mutationFn: async (data: RefreshTokenRequest) => {
                        return authApi.refreshToken(data);
                },
                onSuccess: async (response) => {
                        // Update tokens in store
                        await refresh();
                },
                onError: (error) => {
                        console.error('Refresh token error:', error);

                        // Show error toast for refresh failures
                        Toast.show({
                                type: 'error',
                                text1: 'Session Expired',
                                text2: 'Please sign in again',
                                position: 'top',
                        });
                },
        });
};

// Get current user query
export const useCurrentUserQuery = () => {
        const { isAuthenticated, accessToken } = useAuthStore();

        return useQuery({
                queryKey: authKeys.user(),
                queryFn: async () => {
                        return authApi.getCurrentUser();
                },
                enabled: isAuthenticated && !!accessToken,
                staleTime: 5 * 60 * 1000, // 5 minutes
                retry: (failureCount, error: any) => {
                        // Don't retry on 401 errors (unauthorized)
                        if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
                                return false;
                        }
                        return failureCount < 3;
                },
        });
};

// Auto-refresh token hook
export const useAutoRefreshToken = () => {
        const { refreshToken, refresh } = useAuthStore();
        const refreshMutation = useRefreshTokenMutation();

        return useMutation({
                mutationFn: async () => {
                        if (!refreshToken) {
                                throw new Error('No refresh token available');
                        }
                        return refresh();
                },
                onError: (error) => {
                        console.error('Auto refresh error:', error);
                        // The refresh function in the store already handles logout on failure
                },
        });
};
