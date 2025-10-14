import React, { useCallback, useState } from 'react';
import { View, ScrollView, Modal, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';
import { Button } from '../components/ui/Button';
import { CameraView } from '../components/CameraView';
import {
        fetchProductByBarcode,
        parseOpenFoodFactsData,
        ParsedFoodData,
        addFoodEntry,
        FoodEntry,
} from '../services/api/foodApi';
import { useAuthStore } from '../store';

interface ScanScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
        const { isAuthenticated, user } = useAuthStore();
        const [scanning, setScanning] = useState(true);
        const [loading, setLoading] = useState(false);
        const [result, setResult] = useState<ParsedFoodData | null>(null);
        const [rawResponse, setRawResponse] = useState<any>(null);
        const [showManualModal, setShowManualModal] = useState(false);
        const [saving, setSaving] = useState(false);

        const handleCloseScanner = useCallback(() => {
                setScanning(false);
        }, []);

        const handleBarcode = useCallback(async (code: string) => {
                setLoading(true);
                try {
                        const data = await fetchProductByBarcode(code);
                        // eslint-disable-next-line no-console
                        console.log('OpenFoodFacts response:', data);
                        setRawResponse(data);

                        const parsedData = data ? parseOpenFoodFactsData(data) : null;
                        if (parsedData) {
                                setResult(parsedData);
                        }
                } finally {
                        setLoading(false);
                        setScanning(false);
                }
        }, []);

        const handleAddToDiary = useCallback(async () => {
                if (!result) return;

                if (!isAuthenticated) {
                        console.error('User not authenticated');
                        // TODO: Show login prompt
                        return;
                }

                setSaving(true);
                try {
                        const foodEntry: FoodEntry = {
                                source: 'scan',
                                barcode: result.barcode,
                                dataSource: 'OpenFoodFacts',
                                foodName: result.foodName,
                                brand: result.brand,
                                categories: result.categories,
                                labels: result.labels,
                                ingredients: result.ingredients,
                                allergens: result.allergens,
                                originCountry: result.originCountry,
                                packaging: result.packaging,
                                quantity: 100, // Default to 100g
                                unit: 'g',
                                servingSize: result.servingSize,
                                perServing: true,
                                nutrients: result.nutrients,
                                mealType: 'snack', // Default meal type
                                timestamp: new Date().toISOString(),
                                imageUrl: result.imageUrl,
                                notes: '',
                                isFavorite: false,
                        };

                        console.log('User authenticated:', isAuthenticated);
                        console.log('User ID:', user?.id);

                        const response = await addFoodEntry(foodEntry);
                        if (response.success) {
                                console.log('Food added successfully:', response.data);
                                setResult(null);
                                // TODO: Show success toast
                        } else {
                                console.error('Failed to add food:', response.message);
                                // TODO: Show error toast
                        }
                } catch (error) {
                        console.error('Error adding food to diary:', error);
                        // TODO: Show error toast
                } finally {
                        setSaving(false);
                }
        }, [result, isAuthenticated, user]);

        return (
                <SafeAreaView className="flex-1 bg-background pb-12 pt-4 dark:bg-background-dark">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Header */}
                                        <View className="mb-8">
                                                <CText size="2xl" weight="bold" className="mb-2 text-center">
                                                        Scan Food
                                                </CText>
                                                <CText className="text-center">Scan barcode to log food items</CText>
                                        </View>

                                        {/* Inline Scanner */}
                                        <TouchableOpacity
                                                className="mb-6 overflow-hidden rounded-2xl border border-primary/30"
                                                onPress={() => {
                                                        if (!scanning) {
                                                                setResult(null);
                                                                setRawResponse(null);
                                                                setScanning(true);
                                                        }
                                                }}
                                        >
                                                {scanning ? (
                                                        <View>
                                                                <CameraView
                                                                        onBarcodeScanned={handleBarcode}
                                                                        onClose={() => setScanning(false)}
                                                                />
                                                                {loading && (
                                                                        <View className="absolute bottom-3 left-0 right-0 items-center">
                                                                                <ActivityIndicator
                                                                                        size="small"
                                                                                        color="#4CAF50"
                                                                                />
                                                                                <CText className="mt-1 text-white/80">
                                                                                        Looking up…
                                                                                </CText>
                                                                        </View>
                                                                )}
                                                        </View>
                                                ) : (
                                                        <View className="h-64 items-center justify-center bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                                                <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                        Tap to scan again
                                                                </CText>
                                                        </View>
                                                )}
                                        </TouchableOpacity>

                                        {/* Instructions */}
                                        <View className="mb-6">
                                                <CText className="mb-4 text-lg">How to Scan</CText>

                                                <View className="space-y-3">
                                                        <View className="mb-2 flex-row items-center">
                                                                <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary">
                                                                        <CText className="text-sm text-white">1</CText>
                                                                </View>
                                                                <CText className="">Point camera at barcode</CText>
                                                        </View>

                                                        <View className="mb-2 flex-row items-center">
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
                                                <CText className="mb-3 text-sm text-white">
                                                        You can manually add food items.
                                                </CText>
                                                <Button
                                                        title="Add Food Manually"
                                                        onPress={() => setShowManualModal(true)}
                                                        variant="primary"
                                                        className="bg-white/20"
                                                />
                                        </View>

                                        {/* Footer */}
                                        <View className="items-center">
                                                <CText className="text-xs">Powered by Open Food Facts</CText>
                                        </View>
                                </View>
                        </ScrollView>

                        {/* Result modal */}
                        <Modal
                                visible={!!result}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setResult(null)}
                        >
                                <View className="flex-1 items-center justify-center bg-black/60 p-6">
                                        <View className="w-full max-w-md rounded-2xl bg-surfacePrimary p-5 dark:bg-background-dark">
                                                <CText
                                                        size="2xl"
                                                        weight="bold"
                                                        className="mb-2 text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        {result?.foodName || 'Unknown product'}
                                                </CText>
                                                <CText className="mb-2 text-textSecondary dark:text-textSecondary-dark">
                                                        Brand: {result?.brand || '—'}
                                                </CText>
                                                <CText className="mb-2 text-textSecondary dark:text-textSecondary-dark">
                                                        Categories: {result?.categories?.join(', ') || '—'}
                                                </CText>
                                                <CText className="mb-2 text-textSecondary dark:text-textSecondary-dark">
                                                        Allergens: {result?.allergens?.join(', ') || 'None'}
                                                </CText>
                                                <CText className="mb-4 text-textSecondary dark:text-textSecondary-dark">
                                                        Barcode: {result?.barcode}
                                                </CText>
                                                {!!result?.imageUrl && (
                                                        <Image
                                                                source={{ uri: result.imageUrl }}
                                                                className="mb-4 h-40 w-full rounded-lg"
                                                                resizeMode="cover"
                                                        />
                                                )}
                                                {/* Nutrition per 100g */}
                                                <View className="mb-4 rounded-md bg-black/5 p-3">
                                                        <CText className="mb-2 text-lg font-semibold text-textPrimary dark:text-textPrimary-dark">
                                                                Nutrition (per 100g)
                                                        </CText>
                                                        <View className="space-y-1">
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Calories
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.calories.toFixed(
                                                                                        0,
                                                                                ) || '0'}{' '}
                                                                                kcal
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Protein
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.protein.toFixed(1) ||
                                                                                        '0'}
                                                                                g
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Carbs
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.carbs.toFixed(1) ||
                                                                                        '0'}
                                                                                g
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Sugar
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.sugar.toFixed(1) ||
                                                                                        '0'}
                                                                                g
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Fat
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.fat.toFixed(1) ||
                                                                                        '0'}
                                                                                g
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Saturated Fat
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.saturatedFat.toFixed(
                                                                                        1,
                                                                                ) || '0'}
                                                                                g
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Fiber
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.fiber.toFixed(1) ||
                                                                                        '0'}
                                                                                g
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Cholesterol
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.cholesterol.toFixed(
                                                                                        1,
                                                                                ) || '0'}
                                                                                mg
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Sodium
                                                                        </CText>
                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                {result?.nutrients.sodium.toFixed(1) ||
                                                                                        '0'}
                                                                                mg
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                </View>
                                                <View className="mt-2 flex-row justify-end gap-3">
                                                        <Button
                                                                title={saving ? 'Adding...' : 'Add to Diary'}
                                                                onPress={handleAddToDiary}
                                                                disabled={saving}
                                                        />
                                                        <Button title="Close" onPress={() => setResult(null)} />
                                                </View>
                                        </View>
                                </View>
                        </Modal>

                        {/* Manual Add Modal */}
                        <Modal
                                visible={showManualModal}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setShowManualModal(false)}
                        >
                                <View className="flex-1 items-center justify-center bg-black/60 p-6">
                                        <View className="w-full max-w-md rounded-2xl bg-surfacePrimary p-5 dark:bg-background-dark">
                                                <CText
                                                        size="lg"
                                                        weight="bold"
                                                        className="mb-4 text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        Add Food Manually
                                                </CText>
                                                <CText className="mb-4 text-textSecondary dark:text-textSecondary-dark">
                                                        Manual food entry form coming soon...
                                                </CText>
                                                <View className="mt-2 flex-row justify-end gap-3">
                                                        <Button
                                                                title="Cancel"
                                                                onPress={() => setShowManualModal(false)}
                                                                variant="ghost"
                                                        />
                                                        <Button
                                                                title="Save"
                                                                onPress={() => setShowManualModal(false)}
                                                        />
                                                </View>
                                        </View>
                                </View>
                        </Modal>
                </SafeAreaView>
        );
};
