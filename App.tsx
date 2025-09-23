/**
 * Calog - Authentication UI Demo
 * Production-quality UI-only authentication flow
 *
 * @format
 */

import './global.css';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import BootSplash from 'react-native-bootsplash';
import { useEffect } from 'react';

function App() {
        const isDarkMode = useColorScheme() === 'dark';

        useEffect(() => {
                // Hide bootsplash when app is ready
                BootSplash.hide({ fade: true });
        }, []);

        return (
                <SafeAreaProvider>
                        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                        <AuthNavigator />
                </SafeAreaProvider>
        );
}

export default App;
