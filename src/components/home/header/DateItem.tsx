import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CText } from '../../ui/CText';

interface DateItemProps {
        date: Date;
        onSelectDate: (date: string) => void;
        selected: string | null;
}

export const DateItem: React.FC<DateItemProps> = ({ date, onSelectDate, selected }) => {
        const today = new Date();

        // Reset time to compare only dates (same logic as DiaryHeader)
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        const compareToday = new Date(today);
        compareToday.setHours(0, 0, 0, 0);

        // Format full date for comparison - use local date instead of ISO
        const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        const isToday = compareDate.getTime() === compareToday.getTime();
        const isSelected = selected === fullDate;
        const isCurrentMonth = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

        // Format day number
        const dayNumber = date.getDate().toString();

        // Get day of week
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayOfWeek = dayNames[date.getDay()];

        return (
                <TouchableOpacity
                        onPress={() => onSelectDate(fullDate)}
                        className={`items-center justify-center ${!isCurrentMonth ? 'opacity-50' : ''}`}
                >
                        {isSelected ? (
                                // Pill shape for any selected date
                                <View className="items-center justify-center rounded-full bg-primary p-2">
                                        <CText weight="medium" className="mb-2 text-white">
                                                {dayOfWeek}
                                        </CText>
                                        <View className="size-8 items-center justify-center rounded-full bg-background dark:bg-background-dark">
                                                <CText
                                                        size="sm"
                                                        weight="medium"
                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        {dayNumber}
                                                </CText>
                                        </View>
                                </View>
                        ) : (
                                // Default layout
                                <>
                                        <CText
                                                weight="medium"
                                                className="mb-2 text-textSecondary dark:text-textSecondary-dark"
                                        >
                                                {dayOfWeek}
                                        </CText>
                                        <View
                                                className={`size-8 items-center justify-center rounded-full ${
                                                        isToday && 'border border-primary bg-primary/20'
                                                }`}
                                        >
                                                <CText
                                                        size="sm"
                                                        weight="medium"
                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        {dayNumber}
                                                </CText>
                                        </View>
                                </>
                        )}
                </TouchableOpacity>
        );
};
