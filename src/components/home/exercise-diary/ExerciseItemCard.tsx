import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CText } from '../../ui';
import { Flame, X as XIcon } from 'lucide-react-native';
import { COLORS } from '../../../style/color';
import { useTheme } from '../../../contexts';

export interface ExerciseItemCardProps {
        name: string;
        durationMinutes?: number;
        calories?: number;
        description?: string;
        onPress?: () => void;
        onDelete?: () => void;
}

export const ExerciseItemCard: React.FC<ExerciseItemCardProps> = ({
        name,
        durationMinutes = 30,
        calories = 0,
        description,
        onPress,
        onDelete,
}) => {
        const { isDark } = useTheme();
        return (
                <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={0.8}
                        className="mb-2 flex-row items-center justify-between rounded-xl border border-surfaceSecondary p-3 dark:border-surfaceSecondary-dark"
                >
                        {/* Left: text */}
                        <View className="flex-1">
                                <View className="flex-row items-center gap-2">
                                        <CText
                                                weight="medium"
                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                numberOfLines={1}
                                        >
                                                {name},
                                        </CText>
                                        <CText
                                                weight="medium"
                                                className="text-textSecondary dark:text-textSecondary-dark"
                                        >
                                                {durationMinutes} min
                                        </CText>
                                </View>
                                {description && (
                                        <CText
                                                size="sm"
                                                className="mt-1 text-textSecondary dark:text-textSecondary-dark"
                                                numberOfLines={1}
                                        >
                                                {description}
                                        </CText>
                                )}
                                <View className="mt-1 flex-row items-center gap-1">
                                        <Flame size={14} color={COLORS.ERROR} />
                                        <CText className="!text-primary">{Math.round(calories)} kcal</CText>
                                </View>
                        </View>

                        {/* Right: kcal and delete */}
                        <View className="ml-3 items-end gap-2">
                                {onDelete && (
                                        <TouchableOpacity
                                                onPress={onDelete}
                                                className="size-6 items-center justify-center rounded-full"
                                        >
                                                <XIcon
                                                        size={16}
                                                        color={
                                                                isDark
                                                                        ? COLORS.TEXT_PRIMARY_DARK
                                                                        : COLORS.TEXT_PRIMARY_LIGHT
                                                        }
                                                />
                                        </TouchableOpacity>
                                )}
                        </View>
                </TouchableOpacity>
        );
};
