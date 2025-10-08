import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Logo, CText } from './ui';
import { useTheme } from '../contexts';

interface SplashScreenProps {
        message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ message = 'Loading...' }) => {
        const { isDark } = useTheme();

        return (
                <View
                        className={`flex-1 items-center justify-center ${isDark ? 'bg-background-dark' : 'bg-background'}`}
                >
                        <View className="items-center justify-center">
                                {/* Logo */}
                                <Logo className="animate-spin" size={100} />

                                {/* Loading Message */}
                                <CText
                                        className={`mt-4 text-center !text-primary ${isDark ? 'text-white' : 'text-black'}`}
                                        weight="bold"
                                        size="2xl"
                                >
                                        {message}
                                </CText>
                        </View>
                </View>
        );
};
