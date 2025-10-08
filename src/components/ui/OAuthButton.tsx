import React from 'react';
import { TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import AntDesign from '@react-native-vector-icons/ant-design';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { CText } from './CText';
import { useTheme } from '../../contexts';

interface OAuthButtonProps {
        provider: 'google' | 'apple' | 'facebook';
        onPress: () => void;
        disabled?: boolean;
        className?: string;
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onPress, disabled = false, className = '' }) => {
        const { isDark } = useTheme();

        const getProviderConfig = () => {
                switch (provider) {
                        case 'google':
                                return {
                                        label: 'Continue with Google',
                                        icon: (
                                                <AntDesign
                                                        name="google"
                                                        size={18}
                                                        color={isDark ? '#FFFFFF' : '#000000'}
                                                />
                                        ),
                                };
                        case 'apple':
                                return {
                                        label: 'Continue with Apple',
                                        icon: (
                                                <AntDesign
                                                        name="apple"
                                                        size={18}
                                                        color={isDark ? '#FFFFFF' : '#000000'}
                                                />
                                        ),
                                };
                        case 'facebook':
                                return {
                                        label: 'Continue with Facebook',
                                        icon: (
                                                <FontAwesome
                                                        name="facebook"
                                                        size={18}
                                                        color={isDark ? '#FFFFFF' : '#000000'}
                                                />
                                        ),
                                };
                        default:
                                return {
                                        label: 'Continue with Email',
                                        icon: (
                                                <AntDesign
                                                        name="mail"
                                                        size={18}
                                                        color={isDark ? '#FFFFFF' : '#000000'}
                                                />
                                        ),
                                };
                }
        };

        const config = getProviderConfig();

        return (
                <TouchableOpacity
                        style={{} as ViewStyle}
                        className={`min-h-[48px] items-center justify-center rounded-lg border px-3 py-3 ${disabled ? 'opacity-50' : ''} ${className} ${
                                isDark ? 'border-transparent bg-secondary' : 'border-gray-500 bg-white'
                        }`}
                        onPress={onPress}
                        disabled={disabled}
                        activeOpacity={0.8}
                >
                        <View className="flex-row items-center space-x-3">
                                {config.icon}
                                <CText size="base" className={`pl-3 ${isDark ? '!text-white' : '!text-black'}`}>
                                        {config.label}
                                </CText>
                        </View>
                </TouchableOpacity>
        );
};
