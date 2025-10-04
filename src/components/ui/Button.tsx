import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { CText } from './CText';

interface ButtonProps {
        title: string;
        onPress: () => void;
        variant?: 'primary' | 'ghost' | 'secondary';
        size?: 'small' | 'medium' | 'large';
        loading?: boolean;
        disabled?: boolean;
        className?: string;
}

export const Button: React.FC<ButtonProps> = ({
        title,
        onPress,
        variant = 'primary',
        size = 'medium',
        loading = false,
        disabled = false,
        className = '',
}) => {
        return (
                <TouchableOpacity
                        style={{} as ViewStyle}
                        className={`items-center justify-center rounded-lg ${
                                variant === 'primary'
                                        ? 'bg-primary'
                                        : variant === 'ghost'
                                          ? 'border border-primary/80 bg-transparent'
                                          : 'bg-primary'
                        } ${
                                size === 'small'
                                        ? 'min-h-[36px] px-4 py-2'
                                        : size === 'medium'
                                          ? 'min-h-[48px] px-6 py-3'
                                          : 'min-h-[56px] px-8 py-4'
                        } ${disabled || loading ? 'opacity-50' : ''} ${className}`}
                        onPress={onPress}
                        disabled={disabled || loading}
                        activeOpacity={0.8}
                >
                        {loading ? (
                                <ActivityIndicator size="small" color={variant === 'ghost' ? '#4CAF50' : '#FFFFFF'} />
                        ) : (
                                <CText
                                        size={size === 'small' ? 'sm' : size === 'medium' ? 'base' : 'lg'}
                                        className={`${
                                                variant === 'primary'
                                                        ? 'text-white'
                                                        : variant === 'ghost'
                                                          ? 'text-primary'
                                                          : 'text-text-light'
                                        }`}
                                >
                                        {title}
                                </CText>
                        )}
                </TouchableOpacity>
        );
};
