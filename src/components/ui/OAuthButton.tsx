import React from 'react';
import { TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import AntDesign from '@react-native-vector-icons/ant-design';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { CText } from './CText';

interface OAuthButtonProps {
        provider: 'google' | 'apple' | 'facebook';
        onPress: () => void;
        disabled?: boolean;
        className?: string;
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onPress, disabled = false, className = '' }) => {
        const getProviderConfig = () => {
                switch (provider) {
                        case 'google':
                                return {
                                        label: 'Google',
                                        icon: <AntDesign name="google" size={18} color="#FFFFFF" />,
                                };
                        case 'apple':
                                return {
                                        label: 'Apple',
                                        icon: <AntDesign name="apple" size={18} color="#FFFFFF" />,
                                };
                        case 'facebook':
                                return {
                                        label: 'Facebook',
                                        icon: <FontAwesome name="facebook" size={18} color="#FFFFFF" />,
                                };
                        default:
                                return {
                                        label: 'Continue',
                                        icon: <AntDesign name="mail" size={18} color="#757575" />,
                                };
                }
        };

        const config = getProviderConfig();

        return (
                <TouchableOpacity
                        style={{} as ViewStyle}
                        className={`min-h-[48px] items-center justify-center rounded-lg border border-gray-300 bg-secondary px-3 py-3 ${disabled ? 'opacity-50' : ''} ${className}`}
                        onPress={onPress}
                        disabled={disabled}
                        activeOpacity={0.8}
                >
                        <View className="flex-row items-center space-x-3">
                                {config.icon}
                                <CText size="sm" className="pl-2 text-white">
                                        {config.label}
                                </CText>
                        </View>
                </TouchableOpacity>
        );
};
