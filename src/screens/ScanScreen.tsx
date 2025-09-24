import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';

interface ScanScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
        return (
                <SafeAreaView className="flex-1 bg-primary">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Header */}
                                        <View className="mb-8">
                                                <CText
                                                        size="2xl"
                                                        weight="bold"
                                                        className="text-text-light mb-2 text-center"
                                                >
                                                        Scan Food
                                                </CText>
                                                <CText className="text-text-muted text-center">
                                                        Scan barcode to log food items
                                                </CText>
                                        </View>

                                        {/* Camera Placeholder */}
                                        <View className="mb-6 h-64 items-center justify-center rounded-lg bg-secondary">
                                                <CText className="mb-4 text-6xl">📷</CText>
                                                <CText className="text-text-light text-lg">Camera</CText>
                                                <CText className="text-text-muted mt-2 text-sm">
                                                        Point camera at barcode
                                                </CText>
                                        </View>

                                        {/* Instructions */}
                                        <View className="mb-6">
                                                <CText className="text-text-light mb-4 text-lg">How to Scan</CText>

                                                <View className="space-y-3">
                                                        <View className="flex-row items-center">
                                                                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-tertiary">
                                                                        <CText className="text-sm text-white">1</CText>
                                                                </View>
                                                                <CText className="text-text-muted">
                                                                        Point camera at barcode
                                                                </CText>
                                                        </View>

                                                        <View className="flex-row items-center">
                                                                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-tertiary">
                                                                        <CText className="text-sm text-white">2</CText>
                                                                </View>
                                                                <CText className="text-text-muted">
                                                                        Wait for automatic detection
                                                                </CText>
                                                        </View>

                                                        <View className="flex-row items-center">
                                                                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-tertiary">
                                                                        <CText className="text-sm text-white">3</CText>
                                                                </View>
                                                                <CText className="text-text-muted">
                                                                        Review and log food item
                                                                </CText>
                                                        </View>
                                                </View>
                                        </View>

                                        {/* Manual Entry */}
                                        <View className="mb-6 rounded-lg bg-secondary p-4">
                                                <CText className="text-text-light mb-2">Can't scan?</CText>
                                                <CText className="text-text-muted text-sm">
                                                        You can manually add food items by searching our database.
                                                </CText>
                                        </View>

                                        {/* Footer */}
                                        <View className="items-center">
                                                <CText className="text-text-muted text-xs">
                                                        Camera scanning features coming soon
                                                </CText>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
