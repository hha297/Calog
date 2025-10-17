import React from 'react';
import { View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { CText } from './CText';

interface MacroNutrientProps {
        icon: LucideIcon;
        name: string;
        consumed: number;
        goal: number;
        unit: string;
        color?: string;
}

export const MacroNutrient: React.FC<MacroNutrientProps> = ({
        icon: Icon,
        name,
        consumed,
        goal,
        unit,
        color = '#4CAF50',
}) => {
        const progress = goal > 0 ? (consumed / goal) * 100 : 0;
        const clampedProgress = Math.min(progress, 100);

        return (
                <View className="flex-col items-center px-2 py-1">
                        {/* Icon and Name Row */}
                        <View className="mb-2 flex-row items-center">
                                <Icon size={16} color={color} />
                                <CText weight="medium" className="ml-2 text-textPrimary dark:text-textPrimary-dark">
                                        {name}
                                </CText>
                        </View>

                        {/* Progress Bar */}
                        <View className="mb-2 h-2 w-20 rounded-full bg-background dark:bg-white">
                                <View
                                        className="h-2 rounded-full bg-primary"
                                        style={{
                                                width: `${clampedProgress}%`,
                                        }}
                                />
                        </View>

                        {/* Consumed/Goal */}
                        <CText weight="medium" className="text-textPrimary dark:text-textPrimary-dark">
                                {consumed}/{goal}
                                {unit}
                        </CText>
                </View>
        );
};
