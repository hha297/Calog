import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Logo, CText } from './ui';

interface SplashScreenProps {
        message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ message = 'Loading...' }) => {
        return (
                <View className="bg-background flex-1 items-center justify-center">
                        <View className="items-center justify-center">
                                {/* Logo */}
                                <Logo className="animate-spin" size={100} />

                                {/* Loading Message */}
                                <CText className="mt-4 text-center !text-primary" weight="bold" size="2xl">
                                        {message}
                                </CText>
                        </View>
                </View>
        );
};
