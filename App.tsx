/**
 * Calog - Authentication UI Demo
 * Production-quality UI-only authentication flow
 *
 * @format
 */

import './global.css';
import { StatusBar, useColorScheme, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthNavigator } from './src/navigation/AuthNavigator';

function App() {
        const isDarkMode = useColorScheme() === 'dark';

        return (
                <SafeAreaProvider>
                        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                        <AuthNavigator />
                </SafeAreaProvider>
        );
}

export default App;
