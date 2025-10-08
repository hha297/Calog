import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';

export const DiaryScreen: React.FC = () => {
        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
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
