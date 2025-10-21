import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { CText } from './ui/CText';
import { DateItem } from './DateItem';

interface HorizontalCalendarProps {
        onSelectDate: (date: string) => void;
        selected: string | null;
        width?: number; // optional container width to avoid overlap
}

export const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({ onSelectDate, selected, width }) => {
        const [datePages, setDatePages] = useState<Date[][]>([]);
        const flatListRef = useRef<FlatList>(null);
        const windowDimensions = Dimensions.get('window');
        const pageWidth = width || windowDimensions.width;

        // Generate date pages (7-8 days per page)
        const getDatePages = () => {
                const allDates: Date[] = [];
                const currentYear = new Date().getFullYear();

                // Generate all days from January 1st to December 31st
                for (let month = 0; month < 12; month++) {
                        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
                        for (let day = 1; day <= daysInMonth; day++) {
                                const date = new Date(currentYear, month, day);
                                allDates.push(date);
                        }
                }

                // Split into pages of 7-8 days each
                const pages: Date[][] = [];
                const daysPerPage = 7;

                for (let i = 0; i < allDates.length; i += daysPerPage) {
                        const page = allDates.slice(i, i + daysPerPage);
                        pages.push(page);
                }

                setDatePages(pages);
        };

        const scrollToToday = () => {
                const today = new Date();

                // Find which page contains today's date
                const todayPageIndex = datePages.findIndex((page) =>
                        page.some((date) => {
                                const compareDate = new Date(date);
                                compareDate.setHours(0, 0, 0, 0);
                                const compareToday = new Date(today);
                                compareToday.setHours(0, 0, 0, 0);
                                return compareDate.getTime() === compareToday.getTime();
                        }),
                );

                if (todayPageIndex !== -1 && flatListRef.current) {
                        setTimeout(() => {
                                flatListRef.current?.scrollToIndex({
                                        index: todayPageIndex,
                                        animated: false,
                                });
                        }, 300);
                }
        };

        useEffect(() => {
                getDatePages();
        }, []);

        // Separate useEffect for initial scroll to today
        useEffect(() => {
                if (datePages.length > 0) {
                        const timer = setTimeout(() => {
                                scrollToToday();
                        }, 500);

                        return () => clearTimeout(timer);
                }
        }, [datePages.length]);

        const renderDatePage = ({ item: page }: { item: Date[] }) => {
                return (
                        <View className="flex-row items-center justify-center" style={{ width: pageWidth }}>
                                {page.map((date, index) => (
                                        <View key={index} className="flex-1 items-center pr-3">
                                                <DateItem date={date} onSelectDate={onSelectDate} selected={selected} />
                                        </View>
                                ))}
                        </View>
                );
        };

        return (
                <View className="mr-2 flex-1">
                        {/* Horizontal Paginated Calendar */}
                        <View className="h-16 items-center">
                                <FlatList
                                        ref={flatListRef}
                                        data={datePages}
                                        renderItem={renderDatePage}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        pagingEnabled
                                        snapToInterval={pageWidth}
                                        snapToAlignment="start"
                                        decelerationRate="fast"
                                        getItemLayout={(data, index) => ({
                                                length: pageWidth,
                                                offset: pageWidth * index,
                                                index,
                                        })}
                                        initialScrollIndex={0}
                                />
                        </View>
                </View>
        );
};
