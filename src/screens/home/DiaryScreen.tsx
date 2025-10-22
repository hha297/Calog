import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CText } from '../../components/ui';
import { DiaryHeader } from '../../components/DiaryHeader';
import { CaloriesNutrition } from '../../components/home';
import { useUserProfile } from '../../hooks/useUserProfile';

export const DiaryScreen: React.FC = () => {
        const navigation = useNavigation<any>();
        const [selectedDate, setSelectedDate] = useState(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to avoid timezone issues
                return today;
        });
        const [selectedView, setSelectedView] = useState<'daily' | 'weekly'>('daily');
        const { profile, isLoading } = useUserProfile();

        const handleDateSelect = (date: Date) => {
                const newDate = new Date(date);
                newDate.setHours(0, 0, 0, 0); // Reset time to avoid timezone issues
                setSelectedDate(newDate);
        };

        const handleCalendarPress = () => {
                navigation.navigate('CalendarTracking');
        };

        // Get data from user profile
        const caloriesConsumed = 0; // TODO: Calculate from food logs
        const caloriesBurned = 0; // TODO: Calculate from activity logs

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
                <SafeAreaView className="flex-1 bg-background pb-20 dark:bg-background-dark">
                        <DiaryHeader
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                onCalendarPress={handleCalendarPress}
                        />

                        <ScrollView className="flex-1 px-2 py-4">
                                {/* Calories & Nutrition Section */}
                                <CaloriesNutrition
                                        profile={profile}
                                        caloriesConsumed={caloriesConsumed}
                                        caloriesBurned={caloriesBurned}
                                        selectedView={selectedView}
                                        onViewChange={setSelectedView}
                                />

                                {/* Food Diary Section */}
                        </ScrollView>
                </SafeAreaView>
        );
};
