import React from 'react';
import { View, Image } from 'react-native';
import { Logo, CText } from './ui';
import { useTheme } from '../contexts';
import { COLORS } from '../style/color';

interface SplashScreenProps {
        message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
        const { isDark } = useTheme();

        return (
                <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-white'}`}>
                        <View className="flex-1 items-center justify-center px-6">
                                {/* Logo */}
                                <Logo className="animate-spin" size={100} />

                                {/* Slogan */}
                                <View className="mt-6 flex-col items-center justify-center px-6">
                                        <View className="flex-row items-center justify-center">
                                                <CText className="text-white" weight="bold" size="xl">
                                                        Eating
                                                </CText>
                                                <View className="mx-2 rounded-full bg-primary px-3 py-1">
                                                        <CText className="text-white" weight="bold" size="xl">
                                                                healthy
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-white" weight="bold" size="xl">
                                                made easy!
                                        </CText>
                                </View>
                        </View>

                        {/* Decorative Image */}

                        <Image
                                source={require('../assets/images/SplashScreenDecoration.png')}
                                className="w-full"
                                resizeMode="contain"
                        />
                </View>
        );
};
