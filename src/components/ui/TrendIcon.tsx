import React from 'react';
import { View } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { TrendDirection } from '../../utils/measurementUtils';

interface TrendIconProps {
        direction: TrendDirection;
        size?: number;
        color?: string;
}

export const TrendIcon: React.FC<TrendIconProps> = ({ direction, size = 16, color = '#666666' }) => {
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
