import React from 'react';
import { View } from 'react-native';
import { CText } from '../../components/ui/CText';
import { Logo } from '../../components/ui/Logo';

interface WelcomeSlideProps {
        onNext?: () => void;
        onDataChange?: (data: any) => void;
        profileData?: any;
}

export const WelcomeSlide: React.FC<WelcomeSlideProps> = ({ onNext }) => {
        return (
                <View className="flex-1 items-center justify-center px-8">
                        {/* Logo */}
                        <View className="mb-12">
                                <Logo size={120} />
                        </View>

                        {/* Title */}
                        <CText size="3xl" weight="bold" className="mb-6 text-center text-textPrimary dark:text-white">
                                Welcome to Calog
                        </CText>

                        {/* Subtitle */}
                        <CText size="lg" className="text-center leading-6 text-textSecondary dark:text-gray-300">
                                Your smart companion for tracking calories and staying on goal.
                        </CText>
                </View>
        );
};
