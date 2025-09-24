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
import { initializeAuth } from './src/store';

function App() {
        const isDarkMode = useColorScheme() === 'dark';

        useEffect(() => {
                // Initialize authentication state
                initializeAuth();

                // Hide bootsplash when app is ready
                BootSplash.hide({ fade: true });
        }, []);

        return (
                <SafeAreaProvider>
                        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                        <AppNavigator />
                        <Toast />
                </SafeAreaProvider>
        );
}

export default App;
