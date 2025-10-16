import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CText } from './CText';

interface CircularProgressProps {
        progress: number; // 0-100
        size?: number;
        strokeWidth?: number;
        color?: string;
        backgroundColor?: string;
        children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
        progress,
        size = 120,
        strokeWidth = 8,
        color = '#4CAF50',
        backgroundColor = '#E5E5E5',
        children,
}) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (progress / 100) * circumference;

        return (
                <View className="items-center justify-center" style={{ width: size, height: size }}>
                        <Svg width={size} height={size} style={{ position: 'absolute' }}>
                                {/* Background circle */}
                                <Circle
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        stroke={backgroundColor}
                                        strokeWidth={strokeWidth}
                                        fill="transparent"
                                />
                                {/* Progress circle */}
                                <Circle
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        stroke={color}
                                        strokeWidth={strokeWidth}
                                        fill="transparent"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                                />
                        </Svg>
                        <View
                                style={{ position: 'absolute', width: size, height: size }}
                                className="items-center justify-center"
                        >
                                {children}
                        </View>
                </View>
        );
};
