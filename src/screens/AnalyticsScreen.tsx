import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';

export const AnalyticsScreen: React.FC = () => {
        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        <ScrollView className="flex-1 px-4">
                                <View className="py-4">
                                        <CText size="2xl" weight="bold" className="mb-4">
                                                Analytics
                                        </CText>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
