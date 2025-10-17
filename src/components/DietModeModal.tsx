import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { X, ChevronDown, ChevronUp } from 'lucide-react-native';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { CText, Button } from './ui';
import { DietMode, DIET_MODES, validateMacroPercentages } from '../types/dietModes';
import { useTheme } from '../contexts';

interface DietModeModalProps {
        visible: boolean;
        currentDietMode: DietMode;
        onClose: () => void;
        onSave: (dietMode: DietMode) => void;
}

export const DietModeModal: React.FC<DietModeModalProps> = ({ visible, currentDietMode, onClose, onSave }) => {
        const { isDark } = useTheme();
        const [selectedDietMode, setSelectedDietMode] = useState<DietMode>(currentDietMode);
        const [customCarbs, setCustomCarbs] = useState(currentDietMode.carbsPercentage);
        const [customProtein, setCustomProtein] = useState(currentDietMode.proteinPercentage);
        const [customFat, setCustomFat] = useState(currentDietMode.fatPercentage);
        const [isCustomMode, setIsCustomMode] = useState(currentDietMode.id === 'custom');

        useEffect(() => {
                if (visible) {
                        setSelectedDietMode(currentDietMode);
                        setCustomCarbs(currentDietMode.carbsPercentage);
                        setCustomProtein(currentDietMode.proteinPercentage);
                        setCustomFat(currentDietMode.fatPercentage);
                        setIsCustomMode(currentDietMode.id === 'custom');
                }
        }, [visible, currentDietMode]);

        const handleDietModeSelect = (dietMode: DietMode) => {
                setSelectedDietMode(dietMode);
                setIsCustomMode(dietMode.id === 'custom');

                if (dietMode.id !== 'custom') {
                        setCustomCarbs(dietMode.carbsPercentage);
                        setCustomProtein(dietMode.proteinPercentage);
                        setCustomFat(dietMode.fatPercentage);
                }
        };

        const detectDietModeFromRatios = (carbs: number, protein: number, fat: number): DietMode => {
                // Find exact matching diet mode (no tolerance)
                for (const dietMode of DIET_MODES) {
                        if (dietMode.id === 'custom') continue;

                        const carbsMatch = dietMode.carbsPercentage === carbs;
                        const proteinMatch = dietMode.proteinPercentage === protein;
                        const fatMatch = dietMode.fatPercentage === fat;

                        if (carbsMatch && proteinMatch && fatMatch) {
                                return dietMode;
                        }
                }

                // If no exact match found, return custom mode
                return DIET_MODES.find((mode) => mode.id === 'custom')!;
        };

        const handleCustomMacroChange = (type: 'carbs' | 'protein' | 'fat', index: number) => {
                const currentRange = selectedDietMode[`${type}Range` as keyof DietMode] as number[];
                const value = currentRange[index];

                let newCarbs = customCarbs;
                let newProtein = customProtein;
                let newFat = customFat;

                switch (type) {
                        case 'carbs':
                                newCarbs = value;
                                break;
                        case 'protein':
                                newProtein = value;
                                break;
                        case 'fat':
                                newFat = value;
                                break;
                }

                // Update the values
                setCustomCarbs(newCarbs);
                setCustomProtein(newProtein);
                setCustomFat(newFat);

                // Auto-detect diet mode from new ratios
                const detectedMode = detectDietModeFromRatios(newCarbs, newProtein, newFat);

                // Only update if it's different from current mode
                if (detectedMode.id !== selectedDietMode.id) {
                        setSelectedDietMode(detectedMode);
                        setIsCustomMode(detectedMode.id === 'custom');

                        // Update custom values to match the new diet mode's default ratios
                        if (detectedMode.id !== 'custom') {
                                setCustomCarbs(detectedMode.carbsPercentage);
                                setCustomProtein(detectedMode.proteinPercentage);
                                setCustomFat(detectedMode.fatPercentage);
                        }
                }
        };

        const getCurrentIndex = (type: 'carbs' | 'protein' | 'fat') => {
                const currentRange = selectedDietMode[`${type}Range` as keyof DietMode] as number[];
                const currentValue = type === 'carbs' ? customCarbs : type === 'protein' ? customProtein : customFat;
                return currentRange.findIndex((value) => value === currentValue);
        };

        const handleSave = () => {
                const finalDietMode = isCustomMode
                        ? {
                                  ...selectedDietMode,
                                  carbsPercentage: customCarbs,
                                  proteinPercentage: customProtein,
                                  fatPercentage: customFat,
                          }
                        : selectedDietMode;

                if (isCustomMode && !validateMacroPercentages(customCarbs, customProtein, customFat)) {
                        // Auto-adjust to make total 100%
                        const total = customCarbs + customProtein + customFat;
                        const adjustmentFactor = 100 / total;

                        const adjustedCarbs = Math.round(customCarbs * adjustmentFactor);
                        const adjustedProtein = Math.round(customProtein * adjustmentFactor);
                        const adjustedFat = 100 - adjustedCarbs - adjustedProtein;

                        finalDietMode.carbsPercentage = adjustedCarbs;
                        finalDietMode.proteinPercentage = adjustedProtein;
                        finalDietMode.fatPercentage = adjustedFat;
                }

                onSave(finalDietMode);
        };

        const totalPercentage = customCarbs + customProtein + customFat;
        const isValidTotal = totalPercentage === 100;

        return (
                <Modal
                        transparent
                        visible={visible}
                        animationType="slide"
                        onRequestClose={onClose}
                        statusBarTranslucent={true}
                >
                        <Pressable
                                onPress={onClose}
                                className="flex-1 items-center justify-end bg-black/60"
                                style={{ zIndex: 9999 }}
                        >
                                <Pressable
                                        className="w-full rounded-t-3xl bg-white dark:bg-surfacePrimary-dark"
                                        style={{
                                                zIndex: 10000,
                                                maxHeight: '80%',
                                                elevation: 10,
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: -2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,
                                        }}
                                        onPress={(e) => e.stopPropagation()}
                                >
                                        <ScrollView
                                                contentContainerStyle={{ paddingBottom: 20 }}
                                                showsVerticalScrollIndicator={false}
                                        >
                                                <View className="p-6">
                                                        {/* Header */}
                                                        <View className="mb-6 flex-row items-center justify-between">
                                                                <CText
                                                                        size="2xl"
                                                                        weight="bold"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        Choose Diet Plan
                                                                </CText>

                                                                <TouchableOpacity
                                                                        onPress={onClose}
                                                                        className="rounded-full p-2"
                                                                >
                                                                        <X
                                                                                size={24}
                                                                                color={isDark ? '#FFFFFF' : '#666'}
                                                                        />
                                                                </TouchableOpacity>
                                                        </View>

                                                        {/* Macronutrient Ratio Selection */}
                                                        <View className="mb-6">
                                                                <View className="mb-4 flex-row justify-between">
                                                                        <View className="flex-1 items-center">
                                                                                <CText weight="medium" size="lg">
                                                                                        Carbs
                                                                                </CText>
                                                                                <WheelPicker
                                                                                        style={{
                                                                                                width: 100,
                                                                                                height: 120,

                                                                                                backgroundColor:
                                                                                                        'transparent',
                                                                                        }}
                                                                                        overlayItemStyle={{
                                                                                                backgroundColor:
                                                                                                        '#4CAF50',
                                                                                                borderRadius: 8,
                                                                                                opacity: 0.6,
                                                                                        }}
                                                                                        itemTextStyle={{
                                                                                                color: isDark
                                                                                                        ? '#FFFFFF'
                                                                                                        : '#000000',
                                                                                                fontSize: 18,
                                                                                                fontFamily: 'SpaceGrotesk-Medium',
                                                                                                fontWeight: '500',
                                                                                                paddingHorizontal: 32,
                                                                                        }}
                                                                                        value={
                                                                                                selectedDietMode
                                                                                                        .carbsRange[
                                                                                                        getCurrentIndex(
                                                                                                                'carbs',
                                                                                                        )
                                                                                                ]
                                                                                        }
                                                                                        data={selectedDietMode.carbsRange.map(
                                                                                                (value: number) => ({
                                                                                                        value,
                                                                                                        label: `${value}%`,
                                                                                                }),
                                                                                        )}
                                                                                        onValueChanged={(event) => {
                                                                                                console.log(
                                                                                                        'Event:',
                                                                                                        event,
                                                                                                );
                                                                                                const value =
                                                                                                        event.item
                                                                                                                ?.value;
                                                                                                const index =
                                                                                                        selectedDietMode.carbsRange.findIndex(
                                                                                                                (v) =>
                                                                                                                        v ===
                                                                                                                        value,
                                                                                                        );
                                                                                                handleCustomMacroChange(
                                                                                                        'carbs',
                                                                                                        index,
                                                                                                );
                                                                                        }}
                                                                                />
                                                                        </View>

                                                                        <View className="flex-1 items-center">
                                                                                <CText weight="medium" size="lg">
                                                                                        Protein
                                                                                </CText>
                                                                                <WheelPicker
                                                                                        style={{
                                                                                                width: 100,
                                                                                                height: 120,
                                                                                                backgroundColor:
                                                                                                        'transparent',
                                                                                        }}
                                                                                        overlayItemStyle={{
                                                                                                backgroundColor:
                                                                                                        '#4CAF50',
                                                                                                borderRadius: 8,
                                                                                                opacity: 0.6,
                                                                                        }}
                                                                                        itemTextStyle={{
                                                                                                color: isDark
                                                                                                        ? '#FFFFFF'
                                                                                                        : '#000000',
                                                                                                fontSize: 18,
                                                                                                fontFamily: 'SpaceGrotesk-Medium',
                                                                                                fontWeight: '500',
                                                                                                paddingHorizontal: 32,
                                                                                        }}
                                                                                        value={
                                                                                                selectedDietMode
                                                                                                        .proteinRange[
                                                                                                        getCurrentIndex(
                                                                                                                'protein',
                                                                                                        )
                                                                                                ]
                                                                                        }
                                                                                        data={selectedDietMode.proteinRange.map(
                                                                                                (value: number) => ({
                                                                                                        value,
                                                                                                        label: `${value}%`,
                                                                                                }),
                                                                                        )}
                                                                                        onValueChanged={(event) => {
                                                                                                console.log(
                                                                                                        'Event:',
                                                                                                        event,
                                                                                                );
                                                                                                const value =
                                                                                                        event.item
                                                                                                                ?.value;
                                                                                                const index =
                                                                                                        selectedDietMode.proteinRange.findIndex(
                                                                                                                (v) =>
                                                                                                                        v ===
                                                                                                                        value,
                                                                                                        );
                                                                                                handleCustomMacroChange(
                                                                                                        'protein',
                                                                                                        index,
                                                                                                );
                                                                                        }}
                                                                                />
                                                                        </View>

                                                                        <View className="flex-1 items-center">
                                                                                <CText weight="medium" size="lg">
                                                                                        Fat
                                                                                </CText>
                                                                                <WheelPicker
                                                                                        style={{
                                                                                                width: 100,
                                                                                                height: 120,
                                                                                                backgroundColor:
                                                                                                        'transparent',
                                                                                        }}
                                                                                        overlayItemStyle={{
                                                                                                backgroundColor:
                                                                                                        '#4CAF50',
                                                                                                borderRadius: 8,
                                                                                                opacity: 0.6,
                                                                                        }}
                                                                                        itemTextStyle={{
                                                                                                color: isDark
                                                                                                        ? '#FFFFFF'
                                                                                                        : '#000000',
                                                                                                fontSize: 18,
                                                                                                fontFamily: 'SpaceGrotesk-Medium',
                                                                                                fontWeight: '500',
                                                                                                paddingHorizontal: 32,
                                                                                        }}
                                                                                        value={
                                                                                                selectedDietMode
                                                                                                        .fatRange[
                                                                                                        getCurrentIndex(
                                                                                                                'fat',
                                                                                                        )
                                                                                                ]
                                                                                        }
                                                                                        data={selectedDietMode.fatRange.map(
                                                                                                (value: number) => ({
                                                                                                        value,
                                                                                                        label: `${value}%`,
                                                                                                }),
                                                                                        )}
                                                                                        onValueChanged={(event) => {
                                                                                                console.log(
                                                                                                        'Event:',
                                                                                                        event,
                                                                                                );
                                                                                                const value =
                                                                                                        event.item
                                                                                                                ?.value;
                                                                                                const index =
                                                                                                        selectedDietMode.fatRange.findIndex(
                                                                                                                (v) =>
                                                                                                                        v ===
                                                                                                                        value,
                                                                                                        );
                                                                                                handleCustomMacroChange(
                                                                                                        'fat',
                                                                                                        index,
                                                                                                );
                                                                                        }}
                                                                                />
                                                                        </View>
                                                                </View>

                                                                <View className="flex-row items-center justify-between">
                                                                        <CText size="lg" weight="medium">
                                                                                Total %
                                                                        </CText>
                                                                        <CText
                                                                                size="lg"
                                                                                weight="semibold"
                                                                                className={`font-semibold ${isValidTotal ? '!text-primary' : '!text-status-error'}`}
                                                                        >
                                                                                {totalPercentage.toFixed(0)}%
                                                                        </CText>
                                                                </View>

                                                                <CText className="mt-1 text-sm">
                                                                        Macronutrients must total exactly 100%
                                                                </CText>
                                                        </View>

                                                        {/* Predefined Diet Types */}
                                                        <View className="mb-6">
                                                                <CText
                                                                        size="lg"
                                                                        weight="semibold"
                                                                        className="mb-4 text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        Diet Types
                                                                </CText>

                                                                <View className="flex-row flex-wrap gap-3">
                                                                        {DIET_MODES.map((dietMode: DietMode) => (
                                                                                <TouchableOpacity
                                                                                        key={dietMode.id}
                                                                                        onPress={() =>
                                                                                                handleDietModeSelect(
                                                                                                        dietMode,
                                                                                                )
                                                                                        }
                                                                                        className={`rounded-full border-2 px-6 py-2 ${
                                                                                                selectedDietMode.id ===
                                                                                                dietMode.id
                                                                                                        ? 'border-primary bg-primary/20'
                                                                                                        : 'border-gray-300 bg-surfacePrimary dark:border-surfacePrimary/30 dark:bg-surfacePrimary-dark'
                                                                                        }`}
                                                                                >
                                                                                        <CText
                                                                                                className={`text-center ${
                                                                                                        selectedDietMode.id ===
                                                                                                        dietMode.id
                                                                                                                ? 'text-primary'
                                                                                                                : 'text-textPrimary dark:text-textPrimary-dark'
                                                                                                }`}
                                                                                                weight="medium"
                                                                                        >
                                                                                                {dietMode.name}
                                                                                        </CText>
                                                                                </TouchableOpacity>
                                                                        ))}
                                                                </View>
                                                        </View>

                                                        {/* Save Button */}
                                                        <Button
                                                                title="Save Diet Plan"
                                                                onPress={handleSave}
                                                                className="bg-primary"
                                                                disabled={!isValidTotal}
                                                        />
                                                </View>
                                        </ScrollView>
                                </Pressable>
                        </Pressable>
                </Modal>
        );
};
