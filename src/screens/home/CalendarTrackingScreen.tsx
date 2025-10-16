import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, ZapIcon } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
import { CText } from '../../components/ui/CText';
import { useTheme } from '../../contexts';
import { useUserProfile } from '../../hooks/useUserProfile';

export const CalendarTrackingScreen: React.FC = () => {
        const navigation = useNavigation();
        const { isDark } = useTheme();
        const [selectedDate, setSelectedDate] = useState(new Date());
        const [currentMonth, setCurrentMonth] = useState(new Date());
        const { profile } = useUserProfile();
        console.log(profile);

        // Calculate calorie statistics based on profile
        const dailyCalorieGoal = profile?.dailyCalorieGoal || 0;
        const weightChangeRate = profile?.weightChangeRate || 0; // Daily calorie deficit needed
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const totalCaloriesNeeded = dailyCalorieGoal * daysInMonth;

        // For now, using placeholder values for consumed calories
        // These should be calculated from actual food logs in the future
        const totalCaloriesConsumed = 0; // TODO: Calculate from food logs

        // Calories Deficit Needed = weightChangeRate * days in month
        const caloriesDeficitNeeded = weightChangeRate * daysInMonth;

        // Calories Deficit Achieved = actual deficit based on consumed calories
        const caloriesDeficitAchieved = Math.max(0, totalCaloriesNeeded - totalCaloriesConsumed);
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
                                                <ArrowLeftIcon size={24} color={isDark ? '#FFFFFF' : '#000000'} />
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
                                                                backgroundColor: isDark ? '#252525' : '#FFFFFF',
                                                                calendarBackground: isDark ? '#252525' : '#FFFFFF',
                                                                textSectionTitleColor: isDark ? '#FFFFFF' : '#666666',
                                                                selectedDayBackgroundColor: '#4CAF50',
                                                                selectedDayTextColor: '#FFFFFF',
                                                                todayTextColor: '#4CAF50',
                                                                dayTextColor: isDark ? '#FFFFFF' : '#000000',
                                                                textDisabledColor: isDark ? '#666666' : '#CCCCCC',
                                                                dotColor: '#4CAF50',
                                                                selectedDotColor: '#FFFFFF',
                                                                arrowColor: isDark ? '#FFFFFF' : '#666666',
                                                                monthTextColor: isDark ? '#FFFFFF' : '#000000',
                                                                indicatorColor: '#4CAF50',
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
                                                                setCurrentMonth(
                                                                        new Date(month.year, month.month - 1, 1),
                                                                );
                                                        }}
                                                        markedDates={{
                                                                [formatDateString(selectedDate)]: {
                                                                        selected: true,
                                                                        selectedColor: '#4CAF50',
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
                                                                        0 days
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
                                                                        0 days
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
                                                                        0 days
                                                                </CText>
                                                        </View>
                                                </View>
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

                                                <View className="space-y-3">
                                                        <View className="mb-1 flex-row items-center">
                                                                <ZapIcon size={12} color="#4CAF50" />
                                                                <CText className="ml-2 flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                        Total Calories Needed
                                                                </CText>
                                                                <CText
                                                                        weight="medium"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {totalCaloriesNeeded.toLocaleString()} kcal
                                                                </CText>
                                                        </View>

                                                        <View className="mb-1 flex-row items-center">
                                                                <ZapIcon size={12} color="#FF9800" />
                                                                <CText className="ml-2 flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                        Total Calories Consumed
                                                                </CText>
                                                                <CText
                                                                        weight="medium"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {totalCaloriesConsumed.toLocaleString()} kcal
                                                                </CText>
                                                        </View>

                                                        <View className="mb-1 flex-row items-center">
                                                                <ZapIcon size={12} color="#4CAF50" />
                                                                <CText className="ml-2 flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                        Calories Deficit Needed
                                                                </CText>
                                                                <CText
                                                                        weight="medium"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {caloriesDeficitNeeded.toLocaleString()} kcal
                                                                </CText>
                                                        </View>

                                                        <View className="mb-1 flex-row items-center">
                                                                <ZapIcon size={12} color="#FF9800" />
                                                                <CText className="ml-2 flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                        Calories Deficit Achieved
                                                                </CText>
                                                                <CText
                                                                        weight="medium"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {caloriesDeficitAchieved.toLocaleString()} kcal
                                                                </CText>
                                                        </View>
                                                </View>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
