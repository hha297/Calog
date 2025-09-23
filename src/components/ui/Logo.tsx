import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface LogoProps {
        size?: number;
        style?: ImageStyle;
        className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 24, style, className = '' }) => {
        return (
                <Image
                        source={require('../../assets/images/logo.png')}
                        style={[
                                {
                                        width: size,
                                        height: size,
                                },
                                style,
                        ]}
                        resizeMode="contain"
                        className={className}
                />
        );
};
