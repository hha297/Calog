import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
        ZapIcon,
        Utensils,
        Flame,
        Wheat,
        Beef,
        Apple,
        Carrot,
        HelpCircle,
        ChevronDown,
        Sprout,
        Pizza,
        Droplet,
        Droplets,
} from 'lucide-react-native';
import { CText, CircularProgress, MacroNutrient } from '../ui';
import { UserProfile } from '../../types';
import { DietMode, DIET_MODES } from '../../types/dietModes';
import { DietModeModal } from '../DietModeModal';

interface CaloriesNutritionProps {
        profile: UserProfile | null;
        caloriesConsumed?: number;
        caloriesBurned?: number;
}

export const CaloriesNutrition: React.FC<CaloriesNutritionProps> = ({
        profile,
        caloriesConsumed = 0,
        caloriesBurned = 0,
}) => {
        const [selectedDietMode, setSelectedDietMode] = useState<DietMode>(DIET_MODES[1]); // Default to Low Carb
        const [isDietModalVisible, setIsDietModalVisible] = useState(false);
        // Get data from user profile
        const caloriesNeeded = profile?.dailyCalorieGoal || 0;
        const actualConsumed = caloriesConsumed;
        const caloriesRemaining = caloriesNeeded - actualConsumed;
        const calorieProgress = caloriesNeeded > 0 ? (actualConsumed / caloriesNeeded) * 100 : 0;

        // TODO: Implement proper macro nutrient calculation based on profile and selected diet mode
        const calculateMacroGoals = () => {
                if (!profile) return { carbs: 0, protein: 0, fat: 0, fiber: 0 };

                const calories = caloriesNeeded;
                // Use selected diet mode ratios
                const proteinGrams = Math.round((calories * selectedDietMode.proteinPercentage) / 100 / 4); // 4 cal/g
                const fatGrams = Math.round((calories * selectedDietMode.fatPercentage) / 100 / 9); // 9 cal/g
                const carbGrams = Math.round((calories * selectedDietMode.carbsPercentage) / 100 / 4); // 4 cal/g
                const fiberGrams = Math.round(profile.weight * 0.5); // 0.5g per kg body weight

                return {
                        carbs: carbGrams,
                        protein: proteinGrams,
                        fat: fatGrams,
                        fiber: fiberGrams,
                };
        };

        const macroGoals = calculateMacroGoals();
        const macroNutrients = [
                {
                        name: 'Carbs',
                        consumed: 0, // TODO: Get from actual data
                        goal: macroGoals.carbs,
                        unit: 'g',
                        icon: Wheat,
                        color: '#FF9800',
                },
                {
                        name: 'Protein',
                        consumed: 0, // TODO: Get from actual data
                        goal: macroGoals.protein,
                        unit: 'g',
                        icon: Beef,
                        color: '#F44336',
                },
                {
                        name: 'Fat',
                        consumed: 0, // TODO: Get from actual data
                        goal: macroGoals.fat,
                        unit: 'g',
                        icon: Droplets,
                        color: '#2196F3',
                },
                {
                        name: 'Fiber',
                        consumed: 0, // TODO: Get from actual data
                        goal: macroGoals.fiber,
                        unit: 'g',
                        icon: Sprout,
                        color: '#4CAF50',
                },
        ];

        return (
                <>
                        <View className="mb-6 rounded-2xl bg-surfacePrimary py-4 dark:bg-surfacePrimary-dark">
                                <View className="mb-4 flex-row items-center justify-between px-4">
                                        <CText
                                                size="xl"
                                                weight="bold"
                                                className="text-textPrimary dark:text-textPrimary-dark"
                                        >
                                                Calories & Nutrition
                                        </CText>
                                        <TouchableOpacity className="rounded-full border border-surfacePrimary px-4 py-1">
                                                <CText weight="medium" className="text-primary">
                                                        Statistics
                                                </CText>
                                        </TouchableOpacity>
                                </View>

                                {/* Circular Progress and Calorie Summary */}
                                <View className="mb-6 flex-row justify-between px-8">
                                        {/* Circular Progress for Calories */}
                                        <View className="items-center justify-center">
                                                <CircularProgress
                                                        progress={calorieProgress}
                                                        size={160}
                                                        strokeWidth={8}
                                                        color="#4CAF50"
                                                        backgroundColor="#E5E5E5"
                                                >
                                                        <View className="items-center">
                                                                <CText
                                                                        weight="medium"
                                                                        className="text-textSecondary dark:text-textSecondary-dark"
                                                                >
                                                                        Consumed
                                                                </CText>
                                                                <CText
                                                                        size="3xl"
                                                                        weight="bold"
                                                                        className="!text-primary"
                                                                >
                                                                        {actualConsumed}
                                                                </CText>
                                                        </View>
                                                </CircularProgress>
                                        </View>

                                        {/* Calorie Summary - Side by side with circle */}
                                        <View className="justify-center space-y-4">
                                                <View className="my-2 flex-row items-center">
                                                        <ZapIcon size={24} color="#4CAF50" fill="#4CAF50" />
                                                        <View className="ml-3 flex-col">
                                                                <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                        Needed
                                                                </CText>
                                                                <CText
                                                                        weight="medium"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {caloriesNeeded}
                                                                </CText>
                                                        </View>
                                                </View>
                                                <View className="my-2 flex-row items-center">
                                                        <Utensils size={24} color="#FF9800" fill="#FF9800" />
                                                        <View className="ml-3 flex-col">
                                                                <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                        Remaining
                                                                </CText>
                                                                <CText
                                                                        weight="medium"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {caloriesRemaining}
                                                                </CText>
                                                        </View>
                                                </View>
                                                <View className="my-2 flex-row items-center">
                                                        <Flame size={24} color="#F44336" fill="#F44336" />
                                                        <View className="ml-3 flex-col">
                                                                <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                        Burned
                                                                </CText>
                                                                <CText
                                                                        weight="medium"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {caloriesBurned}
                                                                </CText>
                                                        </View>
                                                </View>
                                        </View>
                                </View>

                                {/* Macronutrients */}
                                <View className="flex-row items-center justify-between px-2">
                                        {macroNutrients.map((macro, index) => (
                                                <View key={index} className="flex-1 items-center">
                                                        <MacroNutrient
                                                                icon={macro.icon}
                                                                name={macro.name}
                                                                consumed={macro.consumed}
                                                                goal={macro.goal}
                                                                unit={macro.unit}
                                                                color={macro.color}
                                                        />
                                                </View>
                                        ))}
                                </View>

                                {/* Diet Mode */}
                                <View className="mt-4 flex-row items-center justify-center px-4">
                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                You are currently on diet mode:{' '}
                                        </CText>
                                        <TouchableOpacity
                                                className="flex-row items-center"
                                                onPress={() => setIsDietModalVisible(true)}
                                        >
                                                <CText weight="medium" className="mx-1 !text-primary underline">
                                                        {selectedDietMode.name}
                                                </CText>
                                                <ChevronDown size={16} color="#4CAF50" />
                                        </TouchableOpacity>
                                </View>
                        </View>

                        {/* Diet Mode Modal */}
                        <DietModeModal
                                visible={isDietModalVisible}
                                currentDietMode={selectedDietMode}
                                onClose={() => setIsDietModalVisible(false)}
                                onSave={(dietMode) => {
                                        setSelectedDietMode(dietMode);
                                        setIsDietModalVisible(false);
                                }}
                        />
                </>
        );
};
