import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ZapIcon, Utensils, Flame, Wheat, Beef, Apple, Carrot, HelpCircle } from 'lucide-react-native';
import { CText, CircularProgress, MacroNutrient } from '../ui';
import { UserProfile } from '../../types';

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
        // Get data from user profile
        const caloriesNeeded = profile?.dailyCalorieGoal || 0;
        // Fake data: 50% consumed for demo
        const fakeConsumed = Math.round(caloriesNeeded * 0.5);
        const actualConsumed = caloriesConsumed > 0 ? caloriesConsumed : fakeConsumed;
        const caloriesRemaining = caloriesNeeded - actualConsumed;
        const calorieProgress = caloriesNeeded > 0 ? (actualConsumed / caloriesNeeded) * 100 : 0;

        // Calculate macronutrient goals based on profile
        const calculateMacroGoals = () => {
                if (!profile) return { carbs: 0, protein: 0, fat: 0, fiber: 0 };

                const calories = caloriesNeeded;
                // TODO: Calculate macronutrient goals based on profile goals (lose, gain, maintain) and target weight
                // General macronutrient ratios
                const proteinGrams = Math.round((calories * 0.25) / 4); // 25% protein, 4 cal/g
                const fatGrams = Math.round((calories * 0.25) / 9); // 25% fat, 9 cal/g
                const carbGrams = Math.round((calories * 0.5) / 4); // 50% carbs, 4 cal/g
                const fiberGrams = Math.round(profile.weight * 0.5); // 0.5g per kg body weight

                return {
                        carbs: carbGrams,
                        protein: proteinGrams,
                        fat: fatGrams,
                        fiber: fiberGrams,
                };
        };

        const macroGoals = calculateMacroGoals();
        // Fake data for progress bars demo
        const macroNutrients = [
                {
                        name: 'Carbs',
                        consumed: Math.round(macroGoals.carbs * 0.3),
                        goal: macroGoals.carbs,
                        unit: 'g',
                        icon: Wheat,
                        color: '#FF9800',
                },
                {
                        name: 'Protein',
                        consumed: Math.round(macroGoals.protein * 0.5),
                        goal: macroGoals.protein,
                        unit: 'g',
                        icon: Beef,
                        color: '#4CAF50',
                },
                {
                        name: 'Fat',
                        consumed: Math.round(macroGoals.fat * 0.2),
                        goal: macroGoals.fat,
                        unit: 'g',
                        icon: Apple,
                        color: '#2196F3',
                },
                {
                        name: 'Fiber',
                        consumed: Math.round(macroGoals.fiber * 0.4),
                        goal: macroGoals.fiber,
                        unit: 'g',
                        icon: Carrot,
                        color: '#9C27B0',
                },
        ];

        return (
                <View className="mb-6 rounded-2xl bg-surfacePrimary py-4 dark:bg-surfacePrimary-dark">
                        <View className="mb-4 flex-row items-center justify-between px-4">
                                <CText size="xl" weight="bold" className="text-textPrimary dark:text-textPrimary-dark">
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
                                                                size="sm"
                                                                weight="medium"
                                                                className="text-textSecondary dark:text-textSecondary-dark"
                                                        >
                                                                Consumed
                                                        </CText>
                                                        <CText size="3xl" weight="bold" className="!text-primary">
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
                        <View className="mt-4 flex-row items-center px-4">
                                <CText className="flex-1 text-textPrimary dark:text-textPrimary-dark">
                                        Goal:{' '}
                                        {profile?.goal === 'lose'
                                                ? 'Weight Loss'
                                                : profile?.goal === 'gain'
                                                  ? 'Weight Gain'
                                                  : 'Maintain Weight'}
                                        {profile?.targetWeight && ` (Target: ${profile.targetWeight}kg)`}
                                </CText>
                                <TouchableOpacity>
                                        <CText className="text-primary">▼</CText>
                                </TouchableOpacity>
                        </View>
                </View>
        );
};
