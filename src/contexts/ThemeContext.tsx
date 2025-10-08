import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';

type ColorSchemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
        colorScheme: 'light' | 'dark'; // Current active theme
        colorSchemePreference: ColorSchemeType; // User preference
        setColorScheme: (scheme: ColorSchemeType) => void;
        isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@calog_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const { colorScheme, setColorScheme: setNativeWindColorScheme } = useColorScheme();
        const [colorSchemePreference, setColorSchemePreference] = useState<ColorSchemeType>('system');

        // Load saved theme preference on mount
        useEffect(() => {
                loadThemePreference();
        }, []);

        // Update StatusBar when theme changes
        useEffect(() => {
                StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content', true);
        }, [colorScheme]);

        const loadThemePreference = async () => {
                try {
                        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                        if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
                                setColorSchemePreference(saved as ColorSchemeType);
                                setNativeWindColorScheme(saved as ColorSchemeType);
                        }
                } catch (error) {
                        console.error('Failed to load theme preference:', error);
                }
        };

        const setColorScheme = async (scheme: ColorSchemeType) => {
                try {
                        setColorSchemePreference(scheme);
                        setNativeWindColorScheme(scheme);
                        await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
                } catch (error) {
                        console.error('Failed to save theme preference:', error);
                }
        };

        const isDark = colorScheme === 'dark';

        return (
                <ThemeContext.Provider
                        value={{
                                colorScheme: colorScheme || 'light',
                                colorSchemePreference,
                                setColorScheme,
                                isDark,
                        }}
                >
                        {children}
                </ThemeContext.Provider>
        );
};

export const useTheme = () => {
        const context = useContext(ThemeContext);
        if (!context) {
                throw new Error('useTheme must be used within ThemeProvider');
        }
        return context;
};
