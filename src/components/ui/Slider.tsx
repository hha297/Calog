import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { CText } from './CText';
import { AlertTriangle } from 'lucide-react-native';
import SliderComponent from '@react-native-community/slider';

export type SliderType = 'weight_goal' | 'height' | 'weight' | 'age' | 'custom';

export interface SliderProps {
        type: SliderType;
        value: number;
        onValueChange: (value: number) => void;
        className?: string;
        label?: string;
        unit?: string;
        goal?: 'maintain' | 'lose' | 'gain'; // Add goal prop for weight_goal slider
        customConfig?: {
                minimumValue: number;
                maximumValue: number;
                step: number;
                safeRange?: { min: number; max: number };
                warningMessage?: string;
        };
}

interface SliderConfig {
        minimumValue: number;
        maximumValue: number;
        step: number;
        defaultValue: number;
        safeRange?: {
                min: number;
                max: number;
        };
        warningMessage?: string;
        label: string;
        unit: string;
        formatValue: (value: number) => string;
        getDisplayText: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
        type,
        value,
        onValueChange,
        className = '',
        label,
        unit,
        goal,
        customConfig,
}) => {
        const [showWarning, setShowWarning] = useState(false);
        const [localValue, setLocalValue] = useState(value);

        // Update local value when prop changes
        useEffect(() => {
                setLocalValue(value);
        }, [value]);

        const getSliderConfig = (): SliderConfig => {
                // Custom config takes priority
                if (customConfig) {
                        return {
                                minimumValue: customConfig.minimumValue,
                                maximumValue: customConfig.maximumValue,
                                step: customConfig.step,
                                defaultValue: customConfig.minimumValue,
                                safeRange: customConfig.safeRange,
                                warningMessage: customConfig.warningMessage,
                                label: label || 'Custom',
                                unit: unit || '',
                                formatValue: (val: number) => `${val}${unit || ''}`,
                                getDisplayText: (val: number) => `${val}${unit || ''}`,
                        };
                }

                switch (type) {
                        case 'weight_goal':
                                return {
                                        minimumValue: 100,
                                        maximumValue: 1000,
                                        step: 50,
                                        defaultValue: 400,
                                        safeRange: { min: 200, max: 800 },
                                        warningMessage: 'Safe calorie deficit/surplus: 200 – 800 kcal/day',
                                        label: 'Daily Calorie Goal',
                                        unit: 'kcal/day',
                                        formatValue: (val: number) => Math.round(val).toString(),
                                        getDisplayText: (val: number) =>
                                                `Your daily calorie ${goal === 'lose' ? 'deficit' : goal === 'gain' ? 'surplus' : 'change'}: ${Math.round(val)} kcal/day`,
                                };

                        case 'height':
                                return {
                                        minimumValue: 100,
                                        maximumValue: 250,
                                        step: 0.5,
                                        defaultValue: 170,
                                        label: 'Height',
                                        unit: 'cm',
                                        formatValue: (val: number) => Math.round(val).toString(),
                                        getDisplayText: (val: number) => `${Math.round(val)} cm`,
                                };

                        case 'weight':
                                return {
                                        minimumValue: 30,
                                        maximumValue: 200,
                                        step: 0.5,
                                        defaultValue: 70,
                                        label: 'Weight',
                                        unit: 'kg',
                                        formatValue: (val: number) => Math.round(val).toString(),
                                        getDisplayText: (val: number) => `${Math.round(val)} kg`,
                                };

                        case 'age':
                                return {
                                        minimumValue: 10,
                                        maximumValue: 100,
                                        step: 1,
                                        defaultValue: 25,
                                        label: 'Age',
                                        unit: 'years',
                                        formatValue: (val: number) => Math.round(val).toString(),
                                        getDisplayText: (val: number) => `${Math.round(val)} years`,
                                };

                        default:
                                return {
                                        minimumValue: 0,
                                        maximumValue: 100,
                                        step: 1,
                                        defaultValue: 50,
                                        label: label || 'Value',
                                        unit: unit || '',
                                        formatValue: (val: number) => Math.round(val).toString(),
                                        getDisplayText: (val: number) => `${Math.round(val)}${unit || ''}`,
                                };
                }
        };

        const config = getSliderConfig();

        const getPaceLabel = (value: number): string => {
                if (type !== 'weight_goal') return '';

                const roundedValue = Math.round(value / 50) * 50; // Round to nearest 50
                if (roundedValue <= 150) return 'Very gentle';
                if (roundedValue <= 250) return 'Gentle';
                if (roundedValue <= 350) return 'Moderate';
                if (roundedValue <= 450) return 'Balanced';
                if (roundedValue <= 550) return 'Standard';
                if (roundedValue <= 650) return 'Intense';
                if (roundedValue <= 750) return 'Aggressive';
                return 'Very aggressive';
        };

        const handleValueChange = (newValue: number) => {
                setLocalValue(newValue);

                // Check for safety warnings only if safeRange is defined
                if (config.safeRange) {
                        const isUnsafe = newValue < config.safeRange.min || newValue > config.safeRange.max;
                        setShowWarning(isUnsafe);
                }
        };

        const handleSlidingComplete = (newValue: number) => {
                onValueChange(newValue);
        };

        // Check initial warning state
        useEffect(() => {
                if (config.safeRange) {
                        const isUnsafe = value < config.safeRange.min || value > config.safeRange.max;
                        setShowWarning(isUnsafe);
                }
        }, [value, config.safeRange]);

        const renderDisplayText = () => {
                if (type === 'weight_goal') {
                        return (
                                <View className="mb-2">
                                        <CText className="text-text-light text-lg font-medium">
                                                {config.getDisplayText(localValue)}
                                        </CText>
                                        <CText className="mt-1 text-sm text-slate-400">
                                                The pace is limited to ensure safe, healthy progress each day.
                                        </CText>
                                </View>
                        );
                }

                return (
                        <View className="mb-2">
                                <CText className="text-text-light text-center text-2xl font-bold">
                                        {config.getDisplayText(localValue)}
                                </CText>
                        </View>
                );
        };

        const renderLabels = () => {
                if (type === 'weight_goal') {
                        return (
                                <View className="mb-4 flex-row justify-between px-2">
                                        <CText className="text-text-muted" weight="medium">
                                                {config.minimumValue} kcal/day
                                        </CText>
                                        <CText className="text-text-muted !text-primary" weight="medium">
                                                {getPaceLabel(localValue)}
                                        </CText>
                                        <CText className="text-text-muted" weight="medium">
                                                {config.maximumValue} kcal/day
                                        </CText>
                                </View>
                        );
                }

                return (
                        <View className="mb-4 flex-row justify-between px-2">
                                <CText className="text-text-muted" weight="medium">
                                        {config.minimumValue}
                                        {config.unit}
                                </CText>
                                <CText className="text-text-muted" weight="medium">
                                        {config.maximumValue}
                                        {config.unit}
                                </CText>
                        </View>
                );
        };

        return (
                <View className={`w-full ${className}`}>
                        {/* Display Text */}
                        {renderDisplayText()}

                        {/* Slider */}
                        <View className="mb-2">
                                <SliderComponent
                                        style={{ width: '100%', height: 40 }}
                                        minimumValue={config.minimumValue}
                                        maximumValue={config.maximumValue}
                                        step={config.step}
                                        value={localValue}
                                        onValueChange={handleValueChange}
                                        onSlidingComplete={handleSlidingComplete}
                                        minimumTrackTintColor="#4CAF50"
                                        maximumTrackTintColor="#374151"
                                        thumbTintColor="#4CAF50"
                                />
                        </View>

                        {/* Labels */}
                        {renderLabels()}

                        {/* Safety Warning */}
                        {showWarning && config.warningMessage && (
                                <View className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                                        <View className="flex-row items-center">
                                                <AlertTriangle size={20} color="#EF4444" className="mr-3" />
                                                <CText className="flex-1 text-sm text-red-400">
                                                        {config.warningMessage}
                                                </CText>
                                        </View>
                                </View>
                        )}
                </View>
        );
};
