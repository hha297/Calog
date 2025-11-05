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
import { COLORS } from '../../style/color';

// Daily View Component
const DailyView: React.FC<{
        caloriesNeeded: number;
        actualConsumed: number;
        caloriesRemaining: number;
        caloriesBurned: number;
        calorieProgress: number;
        macroNutrients: any[];
}> = ({ caloriesNeeded, actualConsumed, caloriesRemaining, caloriesBurned, calorieProgress, macroNutrients }) => {
        const isExceed = caloriesRemaining < 0;
        const caloriesExceed = isExceed ? Math.abs(caloriesRemaining) : 0;
        const displayValue = isExceed ? caloriesExceed : caloriesRemaining;
        const progressColor = isExceed ? COLORS.ERROR : COLORS.PRIMARY;
        const progressValue = isExceed ? Math.min(calorieProgress, 100) : calorieProgress;

        return (
                <>
                        {/* Circular Progress and Calorie Summary */}
                        <View className="mb-6 flex-row justify-between px-5">
                                {/* Circular Progress for Calories */}
                                <View className="items-center justify-center">
                                        <CircularProgress
                                                progress={progressValue}
                                                size={160}
                                                strokeWidth={12}
                                                color={progressColor}
                                                backgroundColor={COLORS.BACKGROUND_GRAY_LIGHT}
                                        >
                                                <View className="items-center">
                                                        <CText 
                                                                size="3xl" 
                                                                weight="bold" 
                                                                className={isExceed ? "!text-status-error" : "!text-primary"}
                                                        >
                                                                {actualConsumed}
                                                        </CText>
                                                        <CText
                                                                weight="medium"
                                                                className="text-textSecondary dark:text-textSecondary-dark"
                                                        >
                                                                Consumed
                                                        </CText>
                                                </View>
                                        </CircularProgress>
                                </View>

                                {/* Daily Summary */}
                                <View className="justify-center space-y-4">
                                        <View className="my-2 flex-row items-center">
                                                <ZapIcon size={24} color={COLORS.SUCCESS} fill={COLORS.SUCCESS} />
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
                                                <Utensils 
                                                        size={24} 
                                                        color={isExceed ? COLORS.ERROR : COLORS.WARNING} 
                                                        fill={isExceed ? COLORS.ERROR : COLORS.WARNING} 
                                                />
                                                <View className="ml-3 flex-col">
                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                {isExceed ? 'Exceed' : 'Remaining'}
                                                        </CText>
                                                        <CText
                                                                weight="medium"
                                                                className={isExceed ? "!text-status-error" : "text-textPrimary dark:text-textPrimary-dark"}
                                                        >
                                                                {isExceed ? '+' : ''}{displayValue}
                                                        </CText>
                                                </View>
                                        </View>
                                        <View className="my-2 flex-row items-center">
                                                <Flame size={24} color={COLORS.ERROR} fill={COLORS.ERROR} />
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

                        {/* Macronutrients - 2x2 Grid Layout */}
                        <View className="px-4">
                                <View className="gap-2">
                                        <View className="mb-2 flex-row justify-between gap-2">
                                                <View className="mr-1 flex-1">
                                                        <MacroNutrient
                                                                icon={macroNutrients[0].icon}
                                                                name={macroNutrients[0].name}
                                                                consumed={macroNutrients[0].consumed}
                                                                goal={macroNutrients[0].goal}
                                                                unit={macroNutrients[0].unit}
                                                                color={macroNutrients[0].color}
                                                        />
                                                </View>
                                                <View className="ml-1 flex-1">
                                                        <MacroNutrient
                                                                icon={macroNutrients[1].icon}
                                                                name={macroNutrients[1].name}
                                                                consumed={macroNutrients[1].consumed}
                                                                goal={macroNutrients[1].goal}
                                                                unit={macroNutrients[1].unit}
                                                                color={macroNutrients[1].color}
                                                        />
                                                </View>
                                        </View>
                                        <View className="flex-row justify-between gap-2">
                                                <View className="mr-1 flex-1">
                                                        <MacroNutrient
                                                                icon={macroNutrients[2].icon}
                                                                name={macroNutrients[2].name}
                                                                consumed={macroNutrients[2].consumed}
                                                                goal={macroNutrients[2].goal}
                                                                unit={macroNutrients[2].unit}
                                                                color={macroNutrients[2].color}
                                                        />
                                                </View>
                                                <View className="ml-1 flex-1">
                                                        <MacroNutrient
                                                                icon={macroNutrients[3].icon}
                                                                name={macroNutrients[3].name}
                                                                consumed={macroNutrients[3].consumed}
                                                                goal={macroNutrients[3].goal}
                                                                unit={macroNutrients[3].unit}
                                                                color={macroNutrients[3].color}
                                                        />
                                                </View>
                                        </View>
                                </View>
                        </View>
                </>
        );
};

// Weekly View Component
const WeeklyView: React.FC<{
        weeklyCaloriesNeeded: number;
        weeklyCaloriesConsumed: number;
        caloriesNeeded: number;
        calorieProgress: number;
        macroNutrients: any[];
}> = ({ weeklyCaloriesNeeded, weeklyCaloriesConsumed, caloriesNeeded, calorieProgress, macroNutrients }) => {
        const isExceed = weeklyCaloriesConsumed > weeklyCaloriesNeeded;
        const progressColor = isExceed ? COLORS.ERROR : COLORS.PRIMARY;
        const progressValue = isExceed ? Math.min(calorieProgress, 100) : calorieProgress;

        return (
                <>
                        {/* Circular Progress and Weekly Bar Chart */}
                        <View className="mb-6 flex-row justify-between px-2">
                                {/* Circular Progress for Weekly Calories */}
                                <View className="mx-2 items-center justify-center">
                                        <CircularProgress
                                                progress={progressValue}
                                                size={100}
                                                strokeWidth={8}
                                                color={progressColor}
                                                backgroundColor={COLORS.BACKGROUND_GRAY_LIGHT}
                                        >
                                                <View className="items-center gap-y-1">
                                                        <CText 
                                                                size="2xl" 
                                                                weight="bold" 
                                                                className={isExceed ? "!text-status-error" : "!text-primary"}
                                                        >
                                                                {weeklyCaloriesConsumed}
                                                        </CText>
                                                        <View className="h-px w-12 bg-textPrimary dark:bg-textPrimary-dark" />
                                                        <CText
                                                                weight="medium"
                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                        >
                                                                {weeklyCaloriesNeeded}
                                                        </CText>
                                                </View>
                                        </CircularProgress>
                                </View>

                                {/* Weekly Bar Chart */}
                                <View className="flex-1 justify-center">
                                        <View className="flex-row justify-between gap-2">
                                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                                        <View key={index} className="items-center">
                                                                <CText className="mb-1 text-sm text-textPrimary dark:text-textPrimary-dark">
                                                                        {caloriesNeeded}
                                                                </CText>
                                                                <View className="mb-1 h-[100px] w-4 rounded-t-full bg-surfaceSecondary dark:bg-background" />
                                                                <CText className="text-sm text-textPrimary dark:text-textPrimary-dark">
                                                                        {day}
                                                                </CText>
                                                        </View>
                                                ))}
                                        </View>
                                </View>
                        </View>

                        {/* Macronutrients - Vertical Layout */}
                        <View className="px-4">
                                <View className="gap-y-2">
                                        {macroNutrients.map((macro, index) => (
                                                <MacroNutrient
                                                        key={index}
                                                        icon={macro.icon}
                                                        name={macro.name}
                                                        consumed={macro.consumed}
                                                        goal={macro.goal}
                                                        unit={macro.unit}
                                                        color={macro.color}
                                                />
                                        ))}
                                </View>
                        </View>
                </>
        );
};

interface CaloriesNutritionProps {
        profile: UserProfile | null;
        caloriesConsumed?: number;
        caloriesBurned?: number;
        selectedView?: 'daily' | 'weekly';
        onViewChange?: (view: 'daily' | 'weekly') => void;
        consumedMacros?: {
                carbs: number;
                protein: number;
                fat: number;
                fiber: number;
        };
}

export const CaloriesNutrition: React.FC<CaloriesNutritionProps> = ({
        profile,
        caloriesConsumed = 0,
        caloriesBurned = 0,
        selectedView = 'daily',
        onViewChange,
        consumedMacros,
}) => {
        const [selectedDietMode, setSelectedDietMode] = useState<DietMode>(DIET_MODES[1]); // Default to Low Carb
        const [isDietModalVisible, setIsDietModalVisible] = useState(false);
        // Get data from user profile
        const caloriesNeeded = profile?.dailyCalorieGoal || 0;
        const actualConsumed = caloriesConsumed;
        const caloriesRemaining = caloriesNeeded - actualConsumed;

        // For weekly view, multiply by 7
        const weeklyCaloriesNeeded = caloriesNeeded * 7;
        const weeklyCaloriesConsumed = actualConsumed * 7;
        const weeklyCaloriesRemaining = weeklyCaloriesNeeded - weeklyCaloriesConsumed;

        const calorieProgress =
                selectedView === 'weekly'
                        ? weeklyCaloriesNeeded > 0
                                ? Math.min((weeklyCaloriesConsumed / weeklyCaloriesNeeded) * 100, 100)
                                : 0
                        : caloriesNeeded > 0
                          ? Math.min((actualConsumed / caloriesNeeded) * 100, 100)
                          : 0;

        // TODO: Implement proper macro nutrient calculation based on profile and selected diet mode
        const calculateMacroGoals = () => {
                if (!profile) return { carbs: 0, protein: 0, fat: 0, fiber: 0 };

                const calories = caloriesNeeded;
                const multiplier = selectedView === 'weekly' ? 7 : 1; // Weekly = daily x 7

                // Use selected diet mode ratios
                const proteinGrams = Math.round((calories * selectedDietMode.proteinPercentage) / 100 / 4) * multiplier; // 4 cal/g
                const fatGrams = Math.round((calories * selectedDietMode.fatPercentage) / 100 / 9) * multiplier; // 9 cal/g
                const carbGrams = Math.round((calories * selectedDietMode.carbsPercentage) / 100 / 4) * multiplier; // 4 cal/g
                const fiberGrams = Math.round(profile.weight * 0.5) * multiplier; // 0.5g per kg body weight

                return {
                        carbs: carbGrams,
                        protein: proteinGrams,
                        fat: fatGrams,
                        fiber: fiberGrams,
                };
        };

        const macroGoals = calculateMacroGoals();
        const multiplier = selectedView === 'weekly' ? 7 : 1;
        const consumed = {
                carbs: (consumedMacros?.carbs || 0) * multiplier,
                protein: (consumedMacros?.protein || 0) * multiplier,
                fat: (consumedMacros?.fat || 0) * multiplier,
                fiber: consumedMacros?.fiber || 0, // Fiber only shown in daily view below
        };
        const macroNutrients = [
                {
                        name: 'Carbs',
                        consumed: consumed.carbs,
                        goal: macroGoals.carbs,
                        unit: 'g',
                        icon: Wheat,
                        color: COLORS.WARNING,
                },
                {
                        name: 'Protein',
                        consumed: consumed.protein,
                        goal: macroGoals.protein,
                        unit: 'g',
                        icon: Beef,
                        color: COLORS.ERROR,
                },
                {
                        name: 'Fat',
                        consumed: consumed.fat,
                        goal: macroGoals.fat,
                        unit: 'g',
                        icon: Droplets,
                        color: COLORS.INFO,
                },
                // Only show Fiber in daily view
                ...(selectedView === 'daily'
                        ? [
                                  {
                                          name: 'Fiber',
                                          consumed: consumed.fiber,
                                          goal: macroGoals.fiber,
                                          unit: 'g',
                                          icon: Sprout,
                                          color: COLORS.PRIMARY,
                                  },
                          ]
                        : []),
        ];

        return (
                <>
                        <View className="mb-6 rounded-2xl bg-surfacePrimary py-4 dark:bg-surfacePrimary-dark">
                                <View className="mb-4 px-4">
                                        <CText
                                                size="xl"
                                                weight="bold"
                                                className="text-textPrimary dark:text-textPrimary-dark"
                                        >
                                                Calories & Nutrition
                                        </CText>
                                </View>

                                {/* Render appropriate view based on selectedView */}
                                {selectedView === 'daily' ? (
                                        <DailyView
                                                caloriesNeeded={caloriesNeeded}
                                                actualConsumed={actualConsumed}
                                                caloriesRemaining={caloriesRemaining}
                                                caloriesBurned={caloriesBurned}
                                                calorieProgress={calorieProgress}
                                                macroNutrients={macroNutrients}
                                        />
                                ) : (
                                        <WeeklyView
                                                weeklyCaloriesNeeded={weeklyCaloriesNeeded}
                                                weeklyCaloriesConsumed={weeklyCaloriesConsumed}
                                                caloriesNeeded={caloriesNeeded}
                                                calorieProgress={calorieProgress}
                                                macroNutrients={macroNutrients}
                                        />
                                )}

                                {/* Diet Mode */}
                                <View className="mt-4 flex-row items-center justify-center px-4">
                                        <CText>You are currently on diet mode: </CText>
                                        <TouchableOpacity
                                                className="flex-row items-center"
                                                onPress={() => setIsDietModalVisible(true)}
                                        >
                                                <CText weight="medium" className="mx-1 !text-primary underline">
                                                        {selectedDietMode.name}
                                                </CText>
                                                <ChevronDown size={16} color={COLORS.PRIMARY} />
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
