import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { CText } from './CText';
import { AlertTriangle } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

interface WeightGoalSliderProps {
        goal: 'lose' | 'gain';
        value: number;
        onValueChange: (value: number) => void;
        className?: string;
}

interface SliderConfig {
        minimumValue: number;
        maximumValue: number;
        step: number;
        defaultValue: number;
        safeRange: {
                min: number;
                max: number;
        };
        warningMessage: string;
}

export const WeightGoalSlider: React.FC<WeightGoalSliderProps> = ({ goal, value, onValueChange, className = '' }) => {
        const [showWarning, setShowWarning] = useState(false);
        const [localValue, setLocalValue] = useState(value);

        // Update local value when prop changes
        useEffect(() => {
                setLocalValue(value);
        }, [value]);

        const getSliderConfig = (): SliderConfig => {
                if (goal === 'lose') {
                        return {
                                minimumValue: 0.1,
                                maximumValue: 1.0,
                                step: 0.1,
                                defaultValue: 0.5,
                                safeRange: { min: 0.1, max: 1.0 },
                                warningMessage: 'Safe weight loss: 0.1 – 1.0 kg/week',
                        };
                } else {
                        return {
                                minimumValue: 0.1,
                                maximumValue: 1.0,
                                step: 0.1,
                                defaultValue: 0.5,
                                safeRange: { min: 0.1, max: 1.0 },
                                warningMessage: 'Safe weight gain: 0.1 – 1.0 kg/week',
                        };
                }
        };

        const config = getSliderConfig();

        const getPaceLabel = (value: number): string => {
                const roundedValue = Math.round(value * 10) / 10; // Round to 1 decimal place
                if (roundedValue <= 0.1) return 'Chill pace';
                if (roundedValue <= 0.2) return 'Easy';
                if (roundedValue <= 0.3) return 'Slow & steady';
                if (roundedValue <= 0.4) return 'Gentle';
                if (roundedValue <= 0.5) return 'Balanced';
                if (roundedValue <= 0.6) return 'Moderate pace';
                if (roundedValue <= 0.7) return 'Standard';
                if (roundedValue <= 0.8) return 'Intense';
                if (roundedValue <= 0.9) return 'Aggressive';
                return 'Hardcore';
        };

        const handleValueChange = (newValue: number) => {
                setLocalValue(newValue);
                // Check for safety warnings
                const isUnsafe = newValue < config.safeRange.min || newValue > config.safeRange.max;
                setShowWarning(isUnsafe);
        };

        const handleSlidingComplete = (newValue: number) => {
                onValueChange(newValue);
        };

        // Check initial warning state
        useEffect(() => {
                const isUnsafe = value < config.safeRange.min || value > config.safeRange.max;
                setShowWarning(isUnsafe);
        }, [value, config.safeRange]);

        return (
                <View className={`w-full ${className}`}>
                        {/* Rate Display */}
                        <View className="mb-2">
                                <CText className="text-text-light text-lg font-medium">
                                        {goal === 'lose' ? 'Your target pace: lose ' : 'Your target pace: gain '}
                                        <CText weight="bold" size="lg" className="!text-tertiary">
                                                {localValue.toFixed(1)} kg/week
                                        </CText>
                                </CText>
                                <CText className="mt-1 text-sm text-slate-400">
                                        The pace is limited to ensure safe, healthy progress each week.
                                </CText>
                        </View>

                        {/* Slider */}
                        <View className="mb-2">
                                <Slider
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

                        {/* Rate Labels */}
                        <View className="mb-4 flex-row justify-between px-2">
                                <CText className="text-text-muted" weight="medium">
                                        {config.minimumValue} kg/week
                                </CText>
                                <CText className="text-text-muted !text-tertiary" weight="medium">
                                        {getPaceLabel(localValue)}
                                </CText>
                                <CText className="text-text-muted" weight="medium">
                                        {config.maximumValue} kg/week
                                </CText>
                        </View>

                        {/* Safety Warning */}
                        {showWarning && (
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
