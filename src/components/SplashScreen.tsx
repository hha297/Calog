import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Logo } from './ui';

interface SplashScreenProps {
        message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ message = 'Loading...' }) => {
        return (
                <View className="flex-1 items-center justify-center bg-primary">
                        <View className="items-center justify-center">
                                {/* Logo */}
                                <Logo className="animate-spin" size={100} />

                                {/* Loading Message */}
                                <Text className="font-space-regular mt-4 text-center text-base text-white">
                                        {message}
                                </Text>
                        </View>
                </View>
        );
};
