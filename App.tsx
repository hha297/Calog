/**
 * Calog - Complete Authentication System
 * Full-stack authentication with JWT, secure storage, and auto-refresh
 *
 * @format
 */

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import BootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { initializeAuth, useAuthStore } from './src/store';
import { GoogleSigninService } from './src/services/googleSigninService';
import { useProfileSync } from './src/hooks/useProfileSync';
import { SplashScreen } from './src/components/SplashScreen';
import { ThemeProvider } from './src/contexts';

function AppContent() {
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
                return <SplashScreen />;
        }

        return (
                <SafeAreaProvider>
                        <AppNavigator />
                        <Toast />
                </SafeAreaProvider>
        );
}

function App() {
        return (
                <ThemeProvider>
                        <AppContent />
                </ThemeProvider>
        );
}

export default App;
