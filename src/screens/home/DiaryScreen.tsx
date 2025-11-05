import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CText } from '../../components/ui';
import { DiaryHeader } from '../../components/home/header/DiaryHeader';
import { CaloriesNutrition, FoodDiary } from '../../components/home/food-diary';
import { ExerciseDiary } from '../../components/home/exercise-diary';
import { useUserProfile } from '../../hooks/useUserProfile';
import { getDailyMeals } from '../../services/api/mealLogApi';
import { getDailyExercises } from '../../services/api/exerciseLogApi';

export const DiaryScreen: React.FC = () => {
        const navigation = useNavigation<any>();
        const [selectedDate, setSelectedDate] = useState(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to avoid timezone issues
                return today;
        });
        const [selectedView, setSelectedView] = useState<'daily' | 'weekly'>('daily');
        const { profile, isLoading } = useUserProfile();

        const [totals, setTotals] = useState({
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
        });
        const [caloriesBurned, setCaloriesBurned] = useState(0);

        const selectedDateISO = useMemo(() => {
                const d = new Date(selectedDate);
                d.setHours(0, 0, 0, 0);
                return d.toISOString();
        }, [selectedDate]);

        const loadTotals = React.useCallback(async () => {
                try {
                        const res: any = await getDailyMeals(selectedDateISO);
                        const day = Array.isArray(res?.data) ? res.data[0] : res?.[0] || res?.data || null;
                        const meals = day?.meals || {};
                        const all = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
                        const sum = all.reduce(
                                (acc, key) => {
                                        const list = meals[key] || [];
                                        list.forEach((it: any) => {
                                                const factor = ((it?.quantityGrams ?? 100) as number) / 100;
                                                acc.calories += (it?.calories ?? 0) * factor;
                                                acc.protein += (it?.protein ?? 0) * factor;
                                                acc.carbs += (it?.carbs ?? 0) * factor;
                                                acc.fat += (it?.fat ?? 0) * factor;
                                                acc.fiber += (it?.fiber ?? 0) * factor;
                                        });
                                        return acc;
                                },
                                { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                        );
                        setTotals(sum);
                } catch {
                        setTotals({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
                }
        }, [selectedDateISO]);

        // Handle totals change from FoodDiary (immediate update)
        const handleTotalsChange = React.useCallback((newTotals: {
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                fiber: number;
        }) => {
                setTotals(newTotals);
        }, []);

        const loadCaloriesBurned = React.useCallback(async () => {
                try {
                        const res: any = await getDailyExercises(selectedDateISO);
                        const day = Array.isArray(res?.data) ? res.data[0] : res?.[0] || res?.data || null;
                        const exercises = day?.exercises || [];
                        const total = exercises.reduce((acc: number, it: any) => {
                                return acc + (it?.calories || 0);
                        }, 0);
                        setCaloriesBurned(Math.round(total));
                } catch {
                        setCaloriesBurned(0);
                }
        }, [selectedDateISO]);

        useEffect(() => {
                loadTotals();
                loadCaloriesBurned();
        }, [loadTotals, loadCaloriesBurned]);

        const handleDateSelect = (date: Date) => {
                const newDate = new Date(date);
                newDate.setHours(0, 0, 0, 0); // Reset time to avoid timezone issues
                setSelectedDate(newDate);
        };

        const handleCalendarPress = () => {
                navigation.navigate('CalendarTracking');
        };

        // Get data from user profile
        const caloriesConsumed = Math.round(totals.calories);

        if (isLoading) {
                return (
                        <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                                <DiaryHeader
                                        selectedDate={selectedDate}
                                        onDateSelect={handleDateSelect}
                                        onCalendarPress={handleCalendarPress}
                                />
                                <View className="flex-1 items-center justify-center">
                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                Loading...
                                        </CText>
                                </View>
                        </SafeAreaView>
                );
        }

        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        <DiaryHeader
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                onCalendarPress={handleCalendarPress}
                        />

                        <ScrollView className="flex-1 px-2 py-4" contentContainerStyle={{ paddingBottom: 120 }}>
                                {/* Calories & Nutrition Section */}
                                <CaloriesNutrition
                                        profile={profile}
                                        caloriesConsumed={caloriesConsumed}
                                        caloriesBurned={caloriesBurned}
                                        selectedView={selectedView}
                                        onViewChange={setSelectedView}
                                        consumedMacros={{
                                                carbs: totals.carbs,
                                                protein: totals.protein,
                                                fat: totals.fat,
                                                fiber: totals.fiber,
                                        }}
                                />

                                {/* Food Diary Section */}
                                <FoodDiary 
                                        selectedDate={selectedDate} 
                                        onMealsChange={loadTotals}
                                        onTotalsChange={handleTotalsChange}
                                />

                                {/* Exercise Diary Section */}
                                <View className="mt-4">
                                        <ExerciseDiary
                                                selectedDate={selectedDate}
                                                onExercisesChange={loadCaloriesBurned}
                                        />
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
