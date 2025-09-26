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
                                text1: '🎉 Account Created!',
                                text2: "Welcome to Calog! Let's start your fitness journey.",
                                position: 'top',
                                visibilityTime: 3000,
                        });
                },
                onError: (error) => {
                        console.error('Signup error:', error);

                        // Parse error message for better user experience
                        let errorTitle = 'Signup Failed';
                        let errorMessage = 'Something went wrong. Please try again.';

                        if (error instanceof Error) {
                                const message = error.message.toLowerCase();
                                if (message.includes('already registered') || message.includes('already exists')) {
                                        errorTitle = 'Email Already Exists';
                                        errorMessage =
                                                'This email is already registered. Please sign in or use a different email.';
                                } else if (message.includes('validation') || message.includes('required')) {
                                        errorTitle = 'Invalid Information';
                                        errorMessage = 'Please check your information and try again.';
                                } else if (message.includes('network') || message.includes('connection')) {
                                        errorTitle = 'Connection Error';
                                        errorMessage = 'Please check your internet connection and try again.';
                                } else {
                                        errorMessage = error.message;
                                }
                        }

                        // Show error toast
                        Toast.show({
                                type: 'error',
                                text1: errorTitle,
                                text2: errorMessage,
                                position: 'top',
                                visibilityTime: 4000,
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
                                text1: '👋 Welcome Back!',
                                text2: `Hello ${response.user.fullName}! Ready to continue your journey?`,
                                position: 'top',
                                visibilityTime: 3000,
                        });
                },
                onError: (error) => {
                        console.error('Login error:', error);

                        // Parse error message for better user experience
                        let errorTitle = 'Login Failed';
                        let errorMessage = 'Invalid credentials. Please try again.';

                        if (error instanceof Error) {
                                const message = error.message.toLowerCase();
                                if (message.includes('account not found') || message.includes('not found')) {
                                        errorTitle = 'Account Not Found';
                                        errorMessage =
                                                'No account found with this email. Please sign up or check your email.';
                                } else if (
                                        message.includes('incorrect password') ||
                                        message.includes('wrong password')
                                ) {
                                        errorTitle = 'Incorrect Password';
                                        errorMessage = 'The password you entered is incorrect. Please try again.';
                                } else if (message.includes('network') || message.includes('connection')) {
                                        errorTitle = 'Connection Error';
                                        errorMessage = 'Please check your internet connection and try again.';
                                } else if (message.includes('unauthorized') || message.includes('invalid')) {
                                        errorTitle = 'Invalid Credentials';
                                        errorMessage = 'Please check your email and password and try again.';
                                } else {
                                        errorMessage = error.message;
                                }
                        }

                        // Show error toast
                        Toast.show({
                                type: 'error',
                                text1: errorTitle,
                                text2: errorMessage,
                                position: 'top',
                                visibilityTime: 4000,
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
                                text1: '👋 Signed Out',
                                text2: 'See you next time! Keep up the great work.',
                                position: 'top',
                                visibilityTime: 3000,
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
        const { refresh, logout } = useAuthStore();

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

                        // Auto-logout on refresh failure
                        logout();
                },
        });
};

// Get current user query
export const useCurrentUserQuery = () => {
        const { isAuthenticated, accessToken, logout } = useAuthStore();

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
                                // Auto-logout on 401 error
                                logout();
                                return false;
                        }
                        return failureCount < 3;
                },
        });
};

// Auto-refresh token hook
export const useAutoRefreshToken = () => {
        const { refreshToken, refresh, logout } = useAuthStore();
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
                        // Auto-logout on refresh failure
                        logout();
                },
        });
};

// Google OAuth login mutation
export const useGoogleLoginMutation = () => {
        const { login } = useAuthStore();
        const queryClient = useQueryClient();

        return useMutation({
                mutationFn: async () => {
                        return authApi.googleSignIn();
                },
                onSuccess: async (response) => {
                        // Login with Google response
                        await login(
                                {
                                        accessToken: response.accessToken,
                                        refreshToken: response.refreshToken,
                                },
                                response.user,
                                true, // Remember user after Google login
                        );

                        // Invalidate and refetch user data
                        queryClient.invalidateQueries({ queryKey: authKeys.user() });

                        // Show success toast
                        Toast.show({
                                type: 'success',
                                text1: '🎉 Welcome!',
                                text2: `Hello ${response.user.name || response.user.email}! Thanks for joining with Google.`,
                                position: 'top',
                                visibilityTime: 3000,
                        });
                },
                onError: (error) => {
                        console.error('Google login error:', error);

                        // Parse error message for better user experience
                        let errorTitle = 'Google Login Failed';
                        let errorMessage = 'Something went wrong with Google sign-in. Please try again.';

                        if (error instanceof Error) {
                                const message = error.message.toLowerCase();
                                if (message.includes('cancelled') || message.includes('canceled')) {
                                        errorTitle = 'Sign-in Cancelled';
                                        errorMessage =
                                                'Google sign-in was cancelled. Please try again if you want to continue.';
                                } else if (message.includes('network') || message.includes('connection')) {
                                        errorTitle = 'Connection Error';
                                        errorMessage = 'Please check your internet connection and try again.';
                                } else if (message.includes('authentication') || message.includes('auth')) {
                                        errorTitle = 'Authentication Error';
                                        errorMessage =
                                                'There was an issue with Google authentication. Please try again.';
                                } else {
                                        errorMessage = error.message;
                                }
                        }

                        // Show error toast
                        Toast.show({
                                type: 'error',
                                text1: errorTitle,
                                text2: errorMessage,
                                position: 'top',
                                visibilityTime: 4000,
                        });
                },
        });
};
