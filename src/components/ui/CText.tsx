import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

interface CTextProps {
        children: React.ReactNode;
        className?: string;
        style?: TextStyle;
        numberOfLines?: number;
        color?: string;
        size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
        weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
        align?: 'left' | 'center' | 'right';
}

export const CText: React.FC<CTextProps> = ({
        children,
        className = '',
        style,
        numberOfLines,
        color = 'text-textPrimary dark:text-white',
        size = 'base',
        weight = 'normal',
        align = 'left',
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
                        default:
                                return 'text-base';
                }
        };

        const getTextAlign = () => {
                switch (align) {
                        case 'center':
                                return 'text-center';
                        case 'right':
                                return 'text-right';
                        default:
                                return 'text-left';
                }
        };

        const defaultStyle: TextStyle = {
                fontFamily: getFontFamily(),
        };

        const combinedClassName = `${getTextSize()} ${getTextAlign()} ${color} ${className}`;

        return (
                <RNText style={[defaultStyle, style]} className={combinedClassName} numberOfLines={numberOfLines}>
                        {children}
                </RNText>
        );
};
