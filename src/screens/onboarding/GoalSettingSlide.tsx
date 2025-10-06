import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Slider } from '../../components/ui/Slider';
import { UserProfile } from '../../types';
import { AlertCircleIcon, Scale, TrendingDown, TrendingUp } from 'lucide-react-native';

interface GoalSettingSlideProps {
        onNext?: () => void;
        onDataChange?: (data: Partial<UserProfile>) => void;
        onValidationChange?: (isValid: boolean) => void;
        profileData?: Partial<UserProfile>;
}

const goalOptions = [
        {
                value: 'maintain',
                label: 'Maintain Weight',
                description: 'Keep your current weight',
                icon: Scale,
        },
        {
                value: 'lose',
                label: 'Lose Weight',
                description: 'Reduce your body weight',
                icon: TrendingDown,
        },
        {
                value: 'gain',
                label: 'Gain Weight',
                description: 'Increase your body weight',
                icon: TrendingUp,
        },
];

export const GoalSettingSlide: React.FC<GoalSettingSlideProps> = ({
        onNext,
        onDataChange,
        onValidationChange,
        profileData,
}) => {
        const [selectedGoal, setSelectedGoal] = useState(profileData?.goal || '');
        const [targetWeight, setTargetWeight] = useState(profileData?.targetWeight?.toString() || '');
        const [weightChangeRate, setWeightChangeRate] = useState(profileData?.weightChangeRate || 400);

        const handleGoalSelect = (goal: string) => {
                setSelectedGoal(goal);
                const newData = { ...profileData, goal: goal as any };

                // Set default values based on goal
                if (goal === 'lose') {
                        newData.weightChangeRate = 400; // default 400 kcal/day deficit
                        setWeightChangeRate(400);
                } else if (goal === 'gain') {
                        newData.weightChangeRate = 400; // default 400 kcal/day surplus
                        setWeightChangeRate(400);
                } else {
                        // Clear weight goal fields for maintain
                        delete newData.weightChangeRate;
                        setWeightChangeRate(0);
                        // Keep targetWeight value for when user switches back
                }

                onDataChange?.(newData);
        };

        const handleTargetWeightChange = (value: string) => {
                setTargetWeight(value);
                const weight = parseFloat(value);
                if (!isNaN(weight)) {
                        onDataChange?.({ ...profileData, targetWeight: weight });
                }
        };

        const handleWeightChangeRateChange = (value: number) => {
                setWeightChangeRate(value);
                onDataChange?.({ ...profileData, weightChangeRate: value });
        };

        const getTargetWeightError = (): string | null => {
                if (!selectedGoal || selectedGoal === 'maintain') return null;

                const targetWeightNum = parseFloat(targetWeight);
                const currentWeight = profileData?.weight;

                if (!currentWeight || isNaN(targetWeightNum)) return null;

                if (selectedGoal === 'lose' && targetWeightNum >= currentWeight) {
                        return `Target weight must be less than current weight (${currentWeight}kg)`;
                }
                if (selectedGoal === 'gain' && targetWeightNum <= currentWeight) {
                        return `Target weight must be greater than current weight (${currentWeight}kg)`;
                }

                return null;
        };

        const isGoalValid = () => {
                if (!selectedGoal) return false;
                if (selectedGoal === 'maintain') return true;

                // For lose/gain goals, require target weight and valid rate
                const targetWeightNum = parseFloat(targetWeight);
                if (isNaN(targetWeightNum) || targetWeightNum <= 0 || weightChangeRate <= 0) {
                        return false;
                }

                // Check target weight validation
                const currentWeight = profileData?.weight;
                if (currentWeight) {
                        if (selectedGoal === 'lose' && targetWeightNum >= currentWeight) {
                                return false; // Target must be less than current for lose
                        }
                        if (selectedGoal === 'gain' && targetWeightNum <= currentWeight) {
                                return false; // Target must be greater than current for gain
                        }
                }

                return true;
        };

        // Notify parent component about validation state
        useEffect(() => {
                onValidationChange?.(isGoalValid());
        }, [selectedGoal, targetWeight, weightChangeRate, onValidationChange]);

        return (
                <View className="flex-1 bg-background px-8 pt-8">
                        <ScrollView
                                className="flex-1"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                        >
                                {/* Header */}
                                <View className="mb-12">
                                        <CText size="2xl" weight="bold" className="text-text-light mb-2 text-center">
                                                Choose your goal
                                        </CText>
                                        <CText size="lg" className="text-text-muted text-center">
                                                Pick the target that best matches your journey.
                                        </CText>
                                </View>

                                {/* Goal Options */}
                                <View className="w-full">
                                        {goalOptions.map((option) => {
                                                const IconComponent = option.icon;
                                                return (
                                                        <TouchableOpacity
                                                                key={option.value}
                                                                onPress={() => handleGoalSelect(option.value)}
                                                                className={`mb-4 rounded-xl border-2 p-6 ${
                                                                        selectedGoal === option.value
                                                                                ? 'border-primary/80 bg-primary'
                                                                                : 'border-surfacePrimary bg-surfacePrimary'
                                                                }`}
                                                        >
                                                                <View className="flex-row items-center">
                                                                        <View
                                                                                className={`mr-4 rounded-lg p-2 ${
                                                                                        selectedGoal === option.value
                                                                                                ? 'bg-white/40'
                                                                                                : 'bg-primary/50'
                                                                                }`}
                                                                        >
                                                                                <IconComponent
                                                                                        size={24}
                                                                                        color={
                                                                                                selectedGoal ===
                                                                                                option.value
                                                                                                        ? '#FFFFFF'
                                                                                                        : '#10B981'
                                                                                        }
                                                                                />
                                                                        </View>
                                                                        <View className="flex-1">
                                                                                <CText
                                                                                        size="lg"
                                                                                        weight="medium"
                                                                                        className={`mb-1 ${
                                                                                                selectedGoal ===
                                                                                                option.value
                                                                                                        ? 'text-white'
                                                                                                        : 'text-text-light'
                                                                                        }`}
                                                                                >
                                                                                        {option.label}
                                                                                </CText>
                                                                                <CText
                                                                                        className={`text-sm ${
                                                                                                selectedGoal ===
                                                                                                option.value
                                                                                                        ? 'text-white/80'
                                                                                                        : 'text-text-muted'
                                                                                        }`}
                                                                                >
                                                                                        {option.description}
                                                                                </CText>
                                                                        </View>
                                                                </View>
                                                        </TouchableOpacity>
                                                );
                                        })}
                                </View>

                                {/* Weight Goal Configuration */}
                                {(selectedGoal === 'lose' || selectedGoal === 'gain') && (
                                        <View>
                                                <CText size="xl" weight="medium" className="text-text-light mb-4">
                                                        Goal Overview
                                                </CText>

                                                {/* Target Weight Input */}
                                                <View className="mb-4">
                                                        <TextField
                                                                label="Target Weight"
                                                                placeholder="Enter target weight"
                                                                value={targetWeight}
                                                                onChangeText={handleTargetWeightChange}
                                                                keyboardType="numeric"
                                                        />
                                                        {/* Target Weight Validation Error */}
                                                        {getTargetWeightError() && (
                                                                <View className="mt-2 flex flex-row items-center rounded-lg border border-status-error/80 bg-status-error/20 p-3">
                                                                        <AlertCircleIcon size={20} color="#F44336" />
                                                                        <CText className="px-2 text-sm !text-status-error">
                                                                                {getTargetWeightError()}
                                                                        </CText>
                                                                </View>
                                                        )}
                                                </View>

                                                {/* Weight Change Rate Slider */}
                                                <View className="mb-4">
                                                        <Slider
                                                                type="weight_goal"
                                                                value={weightChangeRate}
                                                                onValueChange={handleWeightChangeRateChange}
                                                                goal={selectedGoal as 'maintain' | 'lose' | 'gain'}
                                                        />
                                                </View>
                                        </View>
                                )}
                        </ScrollView>
                </View>
        );
};
