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

        return (
                <TouchableOpacity
                        onPress={() => onSelectDate(fullDate)}
                        className={`items-center justify-center ${!isCurrentMonth ? 'opacity-50' : ''}`}
                >
                        <View
                                className={`mb-2 size-10 items-center justify-center rounded-full ${
                                        isSelected
                                                ? 'bg-primary'
                                                : isToday
                                                  ? 'border border-primary bg-primary/20'
                                                  : 'border border-gray-300 bg-transparent dark:border-gray-500'
                                }`}
                        >
                                <CText
                                        size="sm"
                                        weight="medium"
                                        className={`${
                                                isSelected
                                                        ? 'text-white'
                                                        : 'text-textPrimary dark:text-textPrimary-dark'
                                        }`}
                                >
                                        {dayNumber}
                                </CText>
                        </View>
                        {isToday && <View className="-mt-1 size-1 rounded-full bg-primary" />}
                </TouchableOpacity>
        );
};
