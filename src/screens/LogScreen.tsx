import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';

interface LogScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const LogScreen: React.FC<LogScreenProps> = ({ navigation }) => {
        return (
                <SafeAreaView className="flex-1 bg-background">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Header */}
                                        <View className="mb-8">
                                                <CText size="2xl" weight="bold" className="mb-2 text-center">
                                                        Food Log
                                                </CText>
                                                <CText className="text-center">Track your daily nutrition</CText>
                                        </View>

                                        {/* Placeholder Content */}
                                        <View className="mb-6 rounded-lg bg-surfacePrimary p-6">
                                                <CText className="mb-4 text-lg">Today's Log</CText>
                                                <CText className="">
                                                        No food entries yet. Start by scanning a food item or manually
                                                        adding one.
                                                </CText>
                                        </View>

                                        {/* Quick Stats */}
                                        <View className="mb-6">
                                                <CText className="mb-4 text-lg">Quick Stats</CText>

                                                <View className="space-y-3">
                                                        <View className="rounded-lg bg-primary p-4">
                                                                <CText className="">🔥 Calories</CText>
                                                                <CText className="mt-1 text-sm">0 / 2000 kcal</CText>
                                                        </View>

                                                        <View className="rounded-lg bg-primary p-4">
                                                                <CText className="">🥗 Meals</CText>
                                                                <CText className="mt-1 text-sm">0 meals logged</CText>
                                                        </View>

                                                        <View className="rounded-lg bg-primary p-4">
                                                                <CText className="">💧 Water</CText>
                                                                <CText className="mt-1 text-sm">0 / 8 glasses</CText>
                                                        </View>
                                                </View>
                                        </View>

                                        {/* Footer */}
                                        <View className="items-center">
                                                <CText className="text-xs">Food logging features coming soon</CText>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
