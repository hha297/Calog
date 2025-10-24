import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CustomText } from './CustomText';
import { Google, Apple } from './icons';

// Types
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'google'
  | 'apple';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onPress?: () => void;
}

// Size configurations
const getSizeClasses = (size: ButtonSize) => {
  switch (size) {
    case 'large':
      return 'px-6 py-4 rounded-xl';
    case 'medium':
      return 'px-5 py-3 rounded-xl';
    case 'small':
      return 'px-4 py-2 rounded-xl';
    default:
      return 'px-5 py-3 rounded-xl';
  }
};

const getTextSizeClasses = (size: ButtonSize) => {
  switch (size) {
    case 'large':
      return 'text-base';
    case 'medium':
      return 'text-sm';
    case 'small':
      return 'text-xs';
    default:
      return 'text-sm';
  }
};

// Variant styles using existing Tailwind colors and custom hex values
const getVariantClasses = (variant: ButtonVariant, size: ButtonSize) => {
  const sizeClasses = getSizeClasses(size);
  const textSizeClasses = getTextSizeClasses(size);

  switch (variant) {
    case 'primary':
      return {
        container: `${sizeClasses} bg-primary flex-row items-center justify-center`,
        text: `${textSizeClasses} font-semibold`,
      };

    case 'secondary':
      return {
        container: `${sizeClasses} bg-white flex-row items-center justify-center`,
        text: `${textSizeClasses} font-semibold`,
        textColor: 'text-black',
      };

    case 'outline':
      return {
        container: `${sizeClasses} bg-transparent border border-primary flex-row items-center justify-center`,
        text: `${textSizeClasses} font-semibold`,
        textColor: 'text-primary',
      };

    case 'google':
      return {
        container:
          'px-5 py-4 rounded-full bg-darkGray flex-row items-center justify-center',
        text: 'text-base font-medium ml-3',
      };

    case 'apple':
      return {
        container:
          'px-5 py-4 rounded-full bg-darkGray flex-row items-center justify-center',
        text: 'text-base font-medium ml-3',
      };

    default:
      return {
        container: `${sizeClasses} bg-primary flex-row items-center justify-center`,
        text: `${textSizeClasses} font-semibold`,
      };
  }
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  disabled = false,
  onPress,
}) => {
  const variantClasses = getVariantClasses(variant, size);

  const containerClasses = `${variantClasses.container} ${
    disabled ? 'opacity-50' : ''
  } ${className}`;
  const textClasses = `${variantClasses.text} ${disabled ? 'opacity-80' : ''}`;

  return (
    <TouchableOpacity
      className={containerClasses}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      onPress={disabled ? undefined : onPress}
    >
      {variant === 'google' && (
        <View className="w-5 h-5">
          <Google width={20} height={20} />
        </View>
      )}
      {variant === 'apple' && (
        <View className="w-5 h-5">
          <Apple width={20} height={20} />
        </View>
      )}

      <CustomText className={textClasses} color={variantClasses.textColor}>
        {children}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Button;
