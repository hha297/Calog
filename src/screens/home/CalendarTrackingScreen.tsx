import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, ZapIcon } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
import { CText } from '../../components/ui/CText';
import { useTheme } from '../../contexts';
import { useUserProfile } from '../../hooks/useUserProfile';
import { COLORS, getThemeColor } from '../../style/color';
import { getMonthlyMeals } from '../../services/api/mealLogApi';
import { calculateTDEE } from '../../utils/helpers';

interface DailyMealLog {
        date: string;
        meals: {
                breakfast: Array<{ calories?: number; quantityGrams?: number }>;
                lunch: Array<{ calories?: number; quantityGrams?: number }>;
                dinner: Array<{ calories?: number; quantityGrams?: number }>;
                snack: Array<{ calories?: number; quantityGrams?: number }>;
        };
}

export const CalendarTrackingScreen: React.FC = () => {
        const navigation = useNavigation();
        const { isDark } = useTheme();
        const [selectedDate, setSelectedDate] = useState(new Date());
        const [currentMonth, setCurrentMonth] = useState(new Date());
        const { profile } = useUserProfile();
        const [mealLogs, setMealLogs] = useState<DailyMealLog[]>([]);
        const [isLoading, setIsLoading] = useState(false);

        // Fetch meal logs when month changes
        useEffect(() => {
                const fetchMonthlyMeals = async () => {
                        if (!profile) return;

                        try {
                                setIsLoading(true);
                                const month = currentMonth.getMonth() + 1;
                                const year = currentMonth.getFullYear();
                                const logs = (await getMonthlyMeals(month, year)) as DailyMealLog[];
                                setMealLogs(logs || []);
                        } catch (error) {
                                console.error('Error fetching monthly meals:', error);
                                setMealLogs([] as DailyMealLog[]);
                        } finally {
                                setIsLoading(false);
                        }
                };

                fetchMonthlyMeals();
        }, [currentMonth, profile]);

        // Calculate BMR from profile
        const bmr = useMemo(() => {
                if (!profile || !profile.weight || !profile.height || !profile.age || !profile.gender) {
                        return 0;
                }
                const { bmr: calculatedBMR } = calculateTDEE(
                        profile.weight,
                        profile.height,
                        profile.age,
                        profile.gender,
                        profile.activityLevel || 'sedentary',
                );
                return calculatedBMR;
        }, [profile]);

        // Calculate daily calorie goal and other values
        const dailyCalorieGoal = profile?.dailyCalorieGoal || 0;
        const weightChangeRate = profile?.weightChangeRate || 0; // Daily calorie deficit needed
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

        // Calculate daily calories consumed from meal logs
        const dailyCaloriesConsumed = useMemo(() => {
                const dailyMap: Record<string, number> = {};

                mealLogs.forEach((log) => {
                        const dateKey = new Date(log.date).toISOString().split('T')[0];
                        let totalCalories = 0;

                        // Sum calories from all meals
                        // Note: calories are stored per 100g, so we need to adjust by quantityGrams
                        const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = [
                                'breakfast',
                                'lunch',
                                'dinner',
                                'snack',
                        ];

                        mealTypes.forEach((mealType) => {
                                if (log.meals && log.meals[mealType] && Array.isArray(log.meals[mealType])) {
                                        const mealEntries = log.meals[mealType];
                                        let mealCalories = 0;

                                        mealEntries.forEach((entry) => {
                                                const quantityGrams = entry.quantityGrams ?? 100;
                                                const factor = quantityGrams / 100;
                                                const entryCalories = (entry.calories || 0) * factor;
                                                mealCalories += entryCalories;
                                        });

                                        totalCalories += mealCalories;
                                }
                        });

                        dailyMap[dateKey] = Math.round(totalCalories);
                });

                return dailyMap;
        }, [mealLogs]);
        // Calculate total calories needed (sum of dailyCalorieGoal for all days in month)
        const totalCaloriesNeeded = dailyCalorieGoal * daysInMonth;

        // Calculate total calories consumed (sum of all daily consumed)
        const totalCaloriesConsumed = useMemo(() => {
                return Object.values(dailyCaloriesConsumed).reduce((sum, calories) => sum + calories, 0);
        }, [dailyCaloriesConsumed]);

        // Calories Deficit Needed = sum(calories_needed - BMR) for all days
        const caloriesDeficitNeeded = useMemo(() => {
                return (dailyCalorieGoal - bmr) * daysInMonth;
        }, [dailyCalorieGoal, bmr, daysInMonth]);

        // Calories Deficit Achieved = sum(calories_needed - calories_consumed)
        const caloriesDeficitAchieved = useMemo(() => {
                return totalCaloriesNeeded - totalCaloriesConsumed;
        }, [totalCaloriesNeeded, totalCaloriesConsumed]);

        // Diet Summary calculations
        const dietSummary = useMemo(() => {
                let daysWithinRange = 0;
                let daysBelowBMR = 0;
                let daysAboveRequired = 0;

                // Check each day in the month
                for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const dateKey = date.toISOString().split('T')[0];
                        const caloriesConsumed = dailyCaloriesConsumed[dateKey] || 0;

                        // Days eating within recommended range (±5% of calories_needed)
                        const lowerBound = dailyCalorieGoal * 0.95;
                        const upperBound = dailyCalorieGoal * 1.05;
                        if (caloriesConsumed >= lowerBound && caloriesConsumed <= upperBound) {
                                daysWithinRange++;
                        }

                        // Days eating below BMR
                        if (caloriesConsumed < bmr && caloriesConsumed > 0) {
                                daysBelowBMR++;
                        }

                        // Days eating above required amount
                        if (caloriesConsumed > dailyCalorieGoal) {
                                daysAboveRequired++;
                        }
                }

                return {
                        daysWithinRange,
                        daysBelowBMR,
                        daysAboveRequired,
                };
        }, [daysInMonth, currentMonth, dailyCaloriesConsumed, dailyCalorieGoal, bmr]);
        const formatDateString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
        };

        const handleBack = () => {
                navigation.goBack();
        };

        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        <ScrollView
                                className="flex-1"
                                contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}
                                showsVerticalScrollIndicator={true}
                        >
                                {/* Header */}
                                <View className="flex-row items-center justify-between px-4 py-4">
                                        <TouchableOpacity onPress={handleBack}>
                                                <ArrowLeftIcon
                                                        size={24}
                                                        color={isDark ? COLORS.ICON_LIGHT : COLORS.ICON_DARK}
                                                />
                                        </TouchableOpacity>
                                        <CText
                                                size="2xl"
                                                weight="bold"
                                                className="text-textPrimary dark:text-textPrimary-dark"
                                        >
                                                Tracking
                                        </CText>
                                        <View className="w-6" />
                                </View>

                                <View className="px-4">
                                        {/* Calendar Section */}
                                        <View className="mb-6 rounded-2xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                                <Calendar
                                                        style={{
                                                                borderRadius: 16,
                                                                height: 'auto',
                                                        }}
                                                        theme={{
                                                                backgroundColor: isDark
                                                                        ? COLORS.CALENDAR_DARK_BG
                                                                        : COLORS.BACKGROUND_LIGHT,
                                                                calendarBackground: isDark
                                                                        ? COLORS.CALENDAR_DARK_BG
                                                                        : COLORS.BACKGROUND_LIGHT,
                                                                textSectionTitleColor: isDark
                                                                        ? COLORS.CALENDAR_DARK_TEXT
                                                                        : COLORS.GRAY_500,
                                                                selectedDayBackgroundColor: COLORS.PRIMARY,
                                                                selectedDayTextColor: COLORS.ICON_LIGHT,
                                                                todayTextColor: COLORS.PRIMARY,
                                                                dayTextColor: isDark
                                                                        ? COLORS.CALENDAR_DARK_TEXT
                                                                        : COLORS.CALENDAR_LIGHT_TEXT,
                                                                textDisabledColor: isDark
                                                                        ? COLORS.GRAY_500
                                                                        : COLORS.GRAY_100,
                                                                dotColor: COLORS.PRIMARY,
                                                                selectedDotColor: COLORS.ICON_LIGHT,
                                                                arrowColor: isDark
                                                                        ? COLORS.CALENDAR_DARK_TEXT
                                                                        : COLORS.GRAY_500,
                                                                monthTextColor: isDark
                                                                        ? COLORS.CALENDAR_DARK_TEXT
                                                                        : COLORS.CALENDAR_LIGHT_TEXT,
                                                                indicatorColor: COLORS.PRIMARY,
                                                                textDayFontWeight: '600',
                                                                textDayHeaderFontWeight: '600',
                                                                textDayFontSize: 14,
                                                                textDayHeaderFontSize: 14,
                                                                textDayFontFamily: 'SpaceGrotesk-Medium',
                                                                textDayHeaderFontFamily: 'SpaceGrotesk-Medium',
                                                        }}
                                                        current={formatDateString(selectedDate)}
                                                        onDayPress={(day) => {
                                                                setSelectedDate(new Date(day.dateString));
                                                        }}
                                                        onMonthChange={(month) => {
                                                                const newMonth = new Date(
                                                                        month.year,
                                                                        month.month - 1,
                                                                        1,
                                                                );
                                                                setCurrentMonth(newMonth);
                                                                // Reset meal logs when month changes to trigger refetch
                                                                setMealLogs([]);
                                                        }}
                                                        markedDates={{
                                                                [formatDateString(selectedDate)]: {
                                                                        selected: true,
                                                                        selectedColor: COLORS.PRIMARY,
                                                                },
                                                        }}
                                                        hideArrows={false}
                                                        hideExtraDays={true}
                                                        firstDay={1}
                                                        showWeekNumbers={false}
                                                        disableMonthChange={false}
                                                        enableSwipeMonths={true}
                                                        customHeaderTitle={
                                                                <CText
                                                                        size="2xl"
                                                                        weight="bold"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {currentMonth.toLocaleDateString('en-US', {
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                        })}
                                                                </CText>
                                                        }
                                                />
                                        </View>

                                        {/* Dietary Summary Section */}
                                        <View className="mb-6 rounded-2xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                                <CText
                                                        size="xl"
                                                        weight="bold"
                                                        className="mb-4 text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        Diet Summary
                                                </CText>

                                                {isLoading ? (
                                                        <View className="py-4">
                                                                <ActivityIndicator
                                                                        size="small"
                                                                        color={COLORS.PRIMARY}
                                                                />
                                                        </View>
                                                ) : (
                                                        <View className="space-y-3">
                                                                <View className="mb-1 flex-row items-center">
                                                                        <View className="mr-3 size-3 rounded-full bg-green-500" />
                                                                        <CText className="flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Days eating recommended amount
                                                                        </CText>
                                                                        <CText
                                                                                weight="medium"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                {dietSummary.daysWithinRange} days
                                                                        </CText>
                                                                </View>

                                                                <View className="mb-1 flex-row items-center">
                                                                        <View className="mr-3 size-3 rounded-full bg-orange-500" />
                                                                        <CText className="flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Days eating below BMR
                                                                        </CText>
                                                                        <CText
                                                                                weight="medium"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                {dietSummary.daysBelowBMR} days
                                                                        </CText>
                                                                </View>

                                                                <View className="mb-1 flex-row items-center">
                                                                        <View className="mr-3 size-3 rounded-full bg-red-500" />
                                                                        <CText className="flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Days eating over required amount
                                                                        </CText>
                                                                        <CText
                                                                                weight="medium"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                {dietSummary.daysAboveRequired} days
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                )}
                                        </View>

                                        {/* Calorie Statistics Section */}
                                        <View className="mb-6 rounded-2xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                                <CText
                                                        size="xl"
                                                        weight="bold"
                                                        className="mb-4 text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        Calorie Statistics for{' '}
                                                        {currentMonth.toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric',
                                                        })}
                                                </CText>

                                                {isLoading ? (
                                                        <View className="py-4">
                                                                <ActivityIndicator
                                                                        size="small"
                                                                        color={COLORS.PRIMARY}
                                                                />
                                                        </View>
                                                ) : (
                                                        <View className="space-y-3">
                                                                <View className="mb-1 flex-row items-center">
                                                                        <ZapIcon size={12} color={COLORS.PRIMARY} />
                                                                        <CText className="ml-2 flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Total Calories Needed
                                                                        </CText>
                                                                        <CText
                                                                                weight="medium"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                {totalCaloriesNeeded.toLocaleString()}{' '}
                                                                                kcal
                                                                        </CText>
                                                                </View>

                                                                <View className="mb-1 flex-row items-center">
                                                                        <ZapIcon size={12} color={COLORS.WARNING} />
                                                                        <CText className="ml-2 flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Total Calories Consumed
                                                                        </CText>
                                                                        <CText
                                                                                weight="medium"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                {totalCaloriesConsumed.toLocaleString()}{' '}
                                                                                kcal
                                                                        </CText>
                                                                </View>

                                                                <View className="mb-1 flex-row items-center">
                                                                        <ZapIcon size={12} color={COLORS.PRIMARY} />
                                                                        <CText className="ml-2 flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Calories Deficit Needed
                                                                        </CText>
                                                                        <CText
                                                                                weight="medium"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                {caloriesDeficitNeeded.toLocaleString()}{' '}
                                                                                kcal
                                                                        </CText>
                                                                </View>

                                                                <View className="mb-1 flex-row items-center">
                                                                        <ZapIcon size={12} color={COLORS.WARNING} />
                                                                        <CText className="ml-2 flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Calories Deficit Achieved
                                                                        </CText>
                                                                        <CText
                                                                                weight="medium"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                {caloriesDeficitAchieved.toLocaleString()}{' '}
                                                                                kcal
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                )}
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
