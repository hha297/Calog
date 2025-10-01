import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';

export const DiaryScreen: React.FC = () => {
        return (
                <SafeAreaView className="flex-1 bg-primary">
                        <ScrollView className="flex-1 px-4">
                                {/* Summary Card */}
                                <View className="my-4 rounded-2xl p-6">
                                        <CText size="xl" weight="bold" className="mb-4 text-gray-800">
                                                Today's Summary
                                        </CText>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
