import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingScreen } from '../screens/onboarding';
import { useAuthStore } from '../store';
import { RootStackParamList } from '../types';
import { SplashScreen } from '../components/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient({
        defaultOptions: {
                queries: {
                        retry: (failureCount, error: any) => {
                                if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
                                        return false;
                                }
                                return failureCount < 3;
                        },
                        staleTime: 5 * 60 * 1000,
                },
                mutations: {
                        retry: false,
                },
        },
});

export const AppNavigator: React.FC = () => {
        const { isAuthenticated, isLoading, isInitializing } = useAuthStore();
        const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

        useEffect(() => {
                if (isAuthenticated) {
                        checkUserProfile();
                } else {
                        setHasOnboarded(null);
                }
        }, [isAuthenticated]);

        const checkUserProfile = async () => {
                try {
                        const { profileApi } = await import('../services/api/profileApi');
                        const response = await profileApi.getProfile();
                        const hasProfile = !!(
                                response.profile &&
                                response.profile.gender &&
                                response.profile.age &&
                                response.profile.height &&
                                response.profile.weight
                        );
                        setHasOnboarded(hasProfile);
                } catch {
                        setHasOnboarded(false);
                }
        };

        // Show splash khi đang init hoặc loading
        if (isInitializing || isLoading) {
                return <SplashScreen />;
        }

        const shouldShowAuth = !isAuthenticated;
        const shouldShowOnboarding = isAuthenticated && hasOnboarded === false;
        const shouldShowMain = isAuthenticated && hasOnboarded === true;

        if (isAuthenticated && hasOnboarded === null) {
                return <SplashScreen />;
        }

        return (
                <QueryClientProvider client={queryClient}>
                        <NavigationContainer>
                                <Stack.Navigator screenOptions={{ headerShown: false }}>
                                        {shouldShowAuth ? (
                                                <Stack.Screen name="Auth" component={AuthNavigator} />
                                        ) : shouldShowOnboarding ? (
                                                <Stack.Screen name="Onboarding">
                                                        {() => (
                                                                <OnboardingScreen
                                                                        onComplete={() => setHasOnboarded(true)}
                                                                />
                                                        )}
                                                </Stack.Screen>
                                        ) : shouldShowMain ? (
                                                <Stack.Screen name="Main" component={MainNavigator} />
                                        ) : null}
                                </Stack.Navigator>
                        </NavigationContainer>
                </QueryClientProvider>
        );
};
