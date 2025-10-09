import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';

interface ScanScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Header */}
                                        <View className="mb-8">
                                                <CText size="2xl" weight="bold" className="mb-2 text-center">
                                                        Scan Food
                                                </CText>
                                                <CText className="text-center">Scan barcode to log food items</CText>
                                        </View>

                                        {/* Camera Placeholder */}
                                        <View className="mb-6 h-64 items-center justify-center rounded-lg bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                                <CText className="mb-4 text-6xl">📷</CText>
                                                <CText className="text-lg">Camera</CText>
                                                <CText className="mt-2 text-sm">Point camera at barcode</CText>
                                        </View>

                                        {/* Instructions */}
                                        <View className="mb-6">
                                                <CText className="mb-4 text-lg">How to Scan</CText>

                                                <View className="space-y-3">
                                                        <View className="flex-row items-center">
                                                                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary">
                                                                        <CText className="text-sm text-white">1</CText>
                                                                </View>
                                                                <CText className="">Point camera at barcode</CText>
                                                        </View>

                                                        <View className="flex-row items-center">
                                                                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary">
                                                                        <CText className="text-sm text-white">2</CText>
                                                                </View>
                                                                <CText className="">Wait for automatic detection</CText>
                                                        </View>

                                                        <View className="flex-row items-center">
                                                                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary">
                                                                        <CText className="text-sm text-white">3</CText>
                                                                </View>
                                                                <CText className="">Review and log food item</CText>
                                                        </View>
                                                </View>
                                        </View>

                                        {/* Manual Entry */}
                                        <View className="mb-6 rounded-lg bg-primary p-4">
                                                <CText className="mb-2 text-white">Can't scan?</CText>
                                                <CText className="text-sm text-white">
                                                        You can manually add food items by searching our database.
                                                </CText>
                                        </View>

                                        {/* Footer */}
                                        <View className="items-center">
                                                <CText className="text-xs">Camera scanning features coming soon</CText>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
