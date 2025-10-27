import React from 'react';
import { View } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { TrendDirection } from '../../utils/measurementUtils';
import { COLORS } from '../../style/color';

interface TrendIconProps {
        direction: TrendDirection;
        size?: number;
        color?: string;
}

export const TrendIcon: React.FC<TrendIconProps> = ({ direction, size = 16, color = COLORS.GRAY_500 }) => {
        const getIcon = () => {
                switch (direction) {
                        case 'up':
                                return <TrendingUp size={size} color={color} />;
                        case 'down':
                                return <TrendingDown size={size} color={color} />;
                        case 'same':
                        default:
                                return <Minus size={size} color={color} />;
                }
        };

        return <View className="mr-2 items-center justify-center">{getIcon()}</View>;
};
