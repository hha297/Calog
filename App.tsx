/**
 * Calog - Complete Authentication System
 * Full-stack authentication with JWT, secure storage, and auto-refresh
 *
 * @format
 */

import './global.css';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import BootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { initializeAuth, useAuthStore } from './src/store';
import { GoogleSigninService } from './src/services/googleSigninService';
import { useProfileSync } from './src/hooks/useProfileSync';
import { SplashScreen } from './src/components/SplashScreen';

function App() {
        const isDarkMode = useColorScheme() === 'dark';
        const { setupUnauthorizedCallback } = useAuthStore();
        const [ready, setReady] = useState(false);

        // Auto-sync profile khi user login
        useProfileSync();

        useEffect(() => {
                const bootstrap = async () => {
                        try {
                                // Setup unauthorized callback
                                setupUnauthorizedCallback();

                                // Init auth state (check refresh token -> get access token)
                                await initializeAuth();

                                // Init Google Sign-In
                                await GoogleSigninService.initialize();
                        } catch (err) {
                                console.error('App init error:', err);
                        } finally {
                                // Hide splash screen
                                BootSplash.hide({ fade: true });
                                setReady(true);
                        }
                };

                bootstrap();
        }, [setupUnauthorizedCallback]);

        if (!ready) {
                <SplashScreen />;
        }

        return (
                <SafeAreaProvider>
                        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                        <AppNavigator />
                        <Toast />
                </SafeAreaProvider>
        );
}

export default App;
