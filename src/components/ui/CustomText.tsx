import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

interface CustomTextProps {
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
  numberOfLines?: number;
  color?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}

export const CustomText: React.FC<CustomTextProps> = ({
  children,
  className = '',
  style,
  numberOfLines,
  color = 'text-white',
  size = 'base',
  weight = 'normal',
}) => {
  const getFontFamily = () => {
    switch (weight) {
      case 'light':
        return 'SpaceGrotesk-Light';
      case 'medium':
        return 'SpaceGrotesk-Medium';
      case 'semibold':
        return 'SpaceGrotesk-SemiBold';
      case 'bold':
        return 'SpaceGrotesk-Bold';
      default:
        return 'SpaceGrotesk-Regular';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      case '2xl':
        return 'text-2xl';
      case '3xl':
        return 'text-3xl';
      case '4xl':
        return 'text-4xl';
      default:
        return 'text-base';
    }
  };

  const defaultStyle: TextStyle = {
    fontFamily: getFontFamily(),
  };

  const combinedClassName = `${getTextSize()} ${color} ${className}`;

  return (
    <RNText
      style={[defaultStyle, style]}
      className={combinedClassName}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};

export default CustomText;
