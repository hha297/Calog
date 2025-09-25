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
import { useEffect } from 'react';
import { initializeAuth, useAuthStore } from './src/store';
import { GoogleSigninService } from './src/services/googleSigninService';

function App() {
        const isDarkMode = useColorScheme() === 'dark';
        const { setupUnauthorizedCallback } = useAuthStore();

        useEffect(() => {
                // Setup unauthorized callback for auto-logout
                setupUnauthorizedCallback();

                // Initialize authentication state
                initializeAuth();

                // Initialize Google Sign-In
                GoogleSigninService.initialize().catch((error) => {
                        console.error('Failed to initialize Google Sign-In:', error);
                });

                // Hide bootsplash when app is ready
                BootSplash.hide({ fade: true });
        }, [setupUnauthorizedCallback]);

        return (
                <SafeAreaProvider>
                        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                        <AppNavigator />
                        <Toast />
                </SafeAreaProvider>
        );
}

export default App;
