import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BellIcon, CalendarIcon, User } from 'lucide-react-native';
import { CText } from './ui/CText';
import { useAuthStore } from '../store';
import { useTheme } from '../contexts';
import { HorizontalCalendar } from './HorizontalCalendar';

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

        const handleDateSelect = (dateString: string) => {
                const date = new Date(dateString);
                onDateSelect(date);
        };

        const selectedDateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

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
                                <HorizontalCalendar onSelectDate={handleDateSelect} selected={selectedDateString} />

                                {/* Calendar Icon */}
                                <View className="flex-row items-center">
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
