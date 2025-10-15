import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CText } from '../components/ui/CText';
import { DiaryHeader } from '../components/DiaryHeader';

export const DiaryScreen: React.FC = () => {
        const navigation = useNavigation<any>();
        const [selectedDate, setSelectedDate] = useState(() => new Date());

        const handleDateSelect = (date: Date) => {
                setSelectedDate(date);
        };

        const handleCalendarPress = () => {
                navigation.navigate('CalendarTracking');
        };

        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        <DiaryHeader
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                onCalendarPress={handleCalendarPress}
                        />
                        <ScrollView className="flex-1 px-4">
                                {/* Summary Card */}
                                <View className="my-4 rounded-2xl bg-surfacePrimary p-6 dark:bg-surfacePrimary-dark">
                                        <CText
                                                size="xl"
                                                weight="bold"
                                                className="mb-4 text-textPrimary dark:text-textPrimary-dark"
                                        >
                                                Today's Summary
                                        </CText>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
