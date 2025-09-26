import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingScreen } from '../screens/onboarding';
import { useAuthStore, initializeAuth } from '../store';
import { RootStackParamList } from '../types';
import { onboardingStorage } from '../services/onboardingStorage';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Create a client
const queryClient = new QueryClient({
        defaultOptions: {
                queries: {
                        retry: (failureCount, error: any) => {
                                // Don't retry on 401 errors
                                if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
                                        return false;
                                }
                                return failureCount < 3;
                        },
                        staleTime: 5 * 60 * 1000, // 5 minutes
                },
                mutations: {
                        retry: false,
                },
        },
});

export const AppNavigator: React.FC = () => {
        const { isAuthenticated, isLoading } = useAuthStore();
        const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

        // Initialize authentication on app start
        useEffect(() => {
                initializeAuth();
        }, []);

        // Check onboarding status when user is authenticated
        useEffect(() => {
                if (isAuthenticated) {
                        onboardingStorage.hasCompletedOnboarding().then(setHasOnboarded);
                } else {
                        setHasOnboarded(null);
                }
        }, [isAuthenticated]);

        // Show loading screen while checking authentication or onboarding
        if (isLoading || (isAuthenticated && hasOnboarded === null)) {
                // You can replace this with a proper loading screen component
                return null;
        }

        const handleOnboardingComplete = async (profile: any) => {
                try {
                        // Save profile data locally
                        await onboardingStorage.saveUserProfile(profile);
                        // Mark onboarding as completed
                        await onboardingStorage.setOnboardingCompleted();
                        setHasOnboarded(true);
                } catch (error) {
                        console.error('Error completing onboarding:', error);
                }
        };

        return (
                <QueryClientProvider client={queryClient}>
                        <NavigationContainer>
                                <Stack.Navigator screenOptions={{ headerShown: false }}>
                                        {!isAuthenticated ? (
                                                <Stack.Screen name="Auth" component={AuthNavigator} />
                                        ) : !hasOnboarded ? (
                                                <Stack.Screen name="Onboarding">
                                                        {() => (
                                                                <OnboardingScreen
                                                                        onComplete={handleOnboardingComplete}
                                                                />
                                                        )}
                                                </Stack.Screen>
                                        ) : (
                                                <Stack.Screen name="Main" component={MainNavigator} />
                                        )}
                                </Stack.Navigator>
                        </NavigationContainer>
                </QueryClientProvider>
        );
};
