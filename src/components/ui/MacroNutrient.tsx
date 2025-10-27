import React from 'react';
import { View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { CText } from './CText';
import { COLORS } from '../../style/color';

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
        color = COLORS.PRIMARY,
}) => {
        const progress = goal > 0 ? (consumed / goal) * 100 : 0;
        const clampedProgress = Math.min(progress, 100);

        return (
                <View className="rounded-lg bg-surfaceSecondary p-3 dark:bg-surfaceSecondary-dark">
                        {/* Top Row: Icon + Name + Value */}
                        <View className="mb-2 flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                        <Icon size={16} color={color} />
                                        <CText
                                                weight="medium"
                                                className="ml-2 text-textPrimary dark:text-textPrimary-dark"
                                        >
                                                {name}
                                        </CText>
                                </View>
                                <CText weight="medium" className="text-textPrimary dark:text-textPrimary-dark">
                                        {consumed}/{goal}
                                        {unit}
                                </CText>
                        </View>

                        {/* Progress Bar - Full Width */}
                        <View className="h-2 w-full rounded-full bg-white">
                                <View
                                        className="h-2 rounded-full bg-primary"
                                        style={{
                                                width: `${clampedProgress}%`,
                                        }}
                                />
                        </View>
                </View>
        );
};
