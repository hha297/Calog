import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BellIcon, CalendarIcon, User } from 'lucide-react-native';
import { CText } from './ui/CText';
import { useAuthStore } from '../store';
import { useTheme } from '../contexts';

interface DiaryHeaderProps {
        selectedDate: Date;
        onDateSelect: (date: Date) => void;
        onCalendarPress: () => void;
}

export const DiaryHeader: React.FC<DiaryHeaderProps> = ({ selectedDate, onDateSelect, onCalendarPress }) => {
        const navigation = useNavigation<any>();
        const { user } = useAuthStore();
        const { isDark } = useTheme();

        const handleAvatarPress = () => {
                navigation.navigate('Account');
        };

        const formatDateDisplay = (date: Date) => {
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                // Reset time to compare only dates
                const compareDate = new Date(date);
                compareDate.setHours(0, 0, 0, 0);
                const compareToday = new Date(today);
                compareToday.setHours(0, 0, 0, 0);
                const compareYesterday = new Date(yesterday);
                compareYesterday.setHours(0, 0, 0, 0);
                const compareTomorrow = new Date(tomorrow);
                compareTomorrow.setHours(0, 0, 0, 0);

                if (compareDate.getTime() === compareToday.getTime()) {
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();
                        return `TODAY, ${day}.${month}.${year}`;
                } else if (compareDate.getTime() === compareYesterday.getTime()) {
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();
                        return `YESTERDAY, ${day}.${month}.${year}`;
                } else if (compareDate.getTime() === compareTomorrow.getTime()) {
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();
                        return `TOMORROW, ${day}.${month}.${year}`;
                } else {
                        const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                        const dayName = dayNames[date.getDay()];
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();
                        return `${dayName}, ${day}.${month}.${year}`;
                }
        };

        const formatDateSubtitle = (date: Date) => {
                return "HELLO FRIEND, LET'S START TOGETHER!";
        };

        const generateDateOptions = () => {
                const dates = [];
                const today = new Date();
                const currentYear = today.getFullYear();

                // Generate dates for all months (1 to 12)
                for (let month = 0; month < 12; month++) {
                        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

                        for (let day = 1; day <= daysInMonth; day++) {
                                const date = new Date(currentYear, month, day);
                                dates.push(date);
                        }
                }

                return dates;
        };

        const isCurrentMonth = (date: Date) => {
                const today = new Date();
                return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        };

        const isToday = (date: Date) => {
                const today = new Date();
                return date.toDateString() === today.toDateString();
        };

        const isSelectedDate = (date: Date) => {
                return date.toDateString() === selectedDate.toDateString();
        };

        const formatDayNumber = (date: Date) => {
                return date.getDate().toString();
        };

        const scrollViewRef = useRef<ScrollView>(null);

        // Auto-scroll to keep today centered
        useEffect(() => {
                const today = new Date();
                const dates = generateDateOptions();
                const todayIndex = dates.findIndex((date) => date.toDateString() === today.toDateString());

                if (todayIndex !== -1 && scrollViewRef.current) {
                        // Calculate center position - today should be in the middle
                        const screenWidth = 300;
                        const itemWidth = 64;
                        const centerOffset = screenWidth / 2 - itemWidth / 2;
                        const targetX = todayIndex * itemWidth - centerOffset;

                        setTimeout(() => {
                                scrollViewRef.current?.scrollTo({
                                        x: Math.max(0, targetX),
                                        animated: true,
                                });
                        }, 100);
                }
        }, []);

        return (
                <View className="bg-surfacePrimary px-4 pt-4 dark:bg-surfacePrimary-dark">
                        {/* Top Section */}
                        <View className="mb-4 flex-row items-center justify-between">
                                {/* Left Side - Avatar and Date */}
                                <TouchableOpacity className="flex-1 flex-row items-center" onPress={handleAvatarPress}>
                                        <View className="relative mr-3">
                                                <View className="size-12 items-center justify-center rounded-full bg-primary">
                                                        {user?.avatar ? (
                                                                <Image
                                                                        source={{ uri: user.avatar }}
                                                                        className="size-12 rounded-full"
                                                                />
                                                        ) : (
                                                                <User size={24} color="#FFFFFF" />
                                                        )}
                                                </View>
                                        </View>

                                        <View className="flex-1">
                                                <CText
                                                        size="2xl"
                                                        weight="bold"
                                                        className="mb-2 text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        {formatDateDisplay(selectedDate)}
                                                </CText>
                                                <CText
                                                        size="sm"
                                                        weight="medium"
                                                        className="text-textSecondary dark:text-textSecondary-dark"
                                                >
                                                        {formatDateSubtitle(selectedDate)}
                                                </CText>
                                        </View>
                                </TouchableOpacity>

                                {/* Right Side - Notification */}
                                <TouchableOpacity className="ml-4">
                                        <View className="size-10 items-center justify-center rounded-full bg-surfaceSecondary dark:bg-surfaceSecondary-dark">
                                                <BellIcon size={20} color={isDark ? '#FFFFFF' : '#666666'} />
                                        </View>
                                </TouchableOpacity>
                        </View>

                        {/* Date Picker Section */}
                        <View className="mb-4 flex-row items-center">
                                <ScrollView
                                        ref={scrollViewRef}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        className="mr-2 flex-1"
                                        contentContainerStyle={{ paddingRight: 16 }}
                                >
                                        {generateDateOptions().map((date, index) => (
                                                <TouchableOpacity
                                                        key={date.toDateString()}
                                                        className="mr-3 items-center"
                                                        onPress={() => onDateSelect(date)}
                                                >
                                                        <View
                                                                className={`size-12 items-center justify-center rounded-full ${
                                                                        isSelectedDate(date)
                                                                                ? 'bg-primary'
                                                                                : isToday(date)
                                                                                  ? 'border border-primary bg-primary/20'
                                                                                  : isCurrentMonth(date)
                                                                                    ? 'border border-gray-300 bg-transparent dark:border-gray-600'
                                                                                    : 'border border-gray-200 bg-transparent dark:border-gray-700'
                                                                }`}
                                                        >
                                                                <CText
                                                                        size="sm"
                                                                        weight="medium"
                                                                        className={`${
                                                                                isSelectedDate(date)
                                                                                        ? 'text-white'
                                                                                        : isCurrentMonth(date)
                                                                                          ? 'text-textPrimary dark:text-textPrimary-dark'
                                                                                          : 'text-gray-400 dark:text-gray-500'
                                                                        }`}
                                                                >
                                                                        {formatDayNumber(date)}
                                                                </CText>
                                                        </View>
                                                        {isToday(date) && (
                                                                <View className="mt-1 size-1 rounded-full bg-primary" />
                                                        )}
                                                </TouchableOpacity>
                                        ))}
                                </ScrollView>

                                {/* Calendar Icon */}
                                <View className="mb-2 flex-row items-center">
                                        <View className="mr-2 h-12 w-px bg-background dark:bg-gray-600" />
                                        <TouchableOpacity onPress={onCalendarPress}>
                                                <View className="size-10 items-center justify-center rounded-lg bg-surfaceSecondary dark:bg-surfaceSecondary-dark">
                                                        <CalendarIcon
                                                                size={20}
                                                                color={isDark ? '#FFFFFF' : '#666666'}
                                                        />
                                                </View>
                                        </TouchableOpacity>
                                </View>
                        </View>
                </View>
        );
};
