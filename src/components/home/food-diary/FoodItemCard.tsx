import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { CText } from '../../ui';
import { Wheat, Beef, Droplet, X as XIcon } from 'lucide-react-native';
import { COLORS } from '../../../style/color';
import { useTheme } from '../../../contexts';

export interface FoodItemCardProps {
        name: string;
        imageUrl?: string;
        quantityGrams?: number;
        calories?: number;
        carbs?: number;
        protein?: number;
        fat?: number;
        onPress?: () => void;
        onDelete?: () => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
        name,
        imageUrl,
        quantityGrams = 100,
        calories = 0,
        carbs = 0,
        protein = 0,
        fat = 0,
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
                        {/* Left: image and text */}
                        <View className="flex-1 flex-row items-center gap-3">
                                <View className="size-12 overflow-hidden rounded-full bg-background">
                                        {imageUrl ? (
                                                <Image source={{ uri: imageUrl }} className="size-12" />
                                        ) : (
                                                <View className="size-12" />
                                        )}
                                </View>
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
                                                        {quantityGrams} g
                                                </CText>
                                        </View>

                                        {/* Macros row under name */}
                                        <View className="mt-1 flex-row items-center gap-4">
                                                <View className="flex-row items-center gap-1">
                                                        <Wheat size={14} color={COLORS.PRIMARY} />
                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                {Math.round(carbs * (quantityGrams / 100))} g
                                                        </CText>
                                                </View>
                                                <View className="flex-row items-center gap-1">
                                                        <Beef size={14} color={COLORS.ERROR} />
                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                {Math.round(protein * (quantityGrams / 100))} g
                                                        </CText>
                                                </View>
                                                <View className="flex-row items-center gap-1">
                                                        <Droplet size={14} color={COLORS.WARNING} />
                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                {Math.round(fat * (quantityGrams / 100))} g
                                                        </CText>
                                                </View>
                                        </View>
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
                                <CText className="!text-primary">
                                        {Math.round(calories * (quantityGrams / 100))} kcal
                                </CText>
                        </View>
                </TouchableOpacity>
        );
};

// TODO: Implement food item card component
