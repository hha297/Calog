import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';
import { UserProfile } from '../../types';
import { Scale, TrendingDown, TrendingUp } from 'lucide-react-native';

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

        const handleGoalSelect = (goal: string) => {
                setSelectedGoal(goal);
                onDataChange?.({ ...profileData, goal: goal as any });
        };

        const isGoalValid = !!selectedGoal;

        // Notify parent component about validation state
        useEffect(() => {
                onValidationChange?.(isGoalValid);
        }, [isGoalValid, onValidationChange]);

        return (
                <View className="flex-1 bg-primary px-8 pt-8">
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
                                <View className="mb-12 w-full">
                                        {goalOptions.map((option) => {
                                                const IconComponent = option.icon;
                                                return (
                                                        <TouchableOpacity
                                                                key={option.value}
                                                                onPress={() => handleGoalSelect(option.value)}
                                                                className={`mb-4 rounded-xl border-2 p-6 ${
                                                                        selectedGoal === option.value
                                                                                ? 'border-tertiary bg-tertiary/10'
                                                                                : 'border-gray-300'
                                                                }`}
                                                        >
                                                                <View className="flex-row items-center">
                                                                        <View className="mr-4 rounded-lg bg-tertiary/20 p-2">
                                                                                <IconComponent
                                                                                        size={24}
                                                                                        color="#10B981"
                                                                                />
                                                                        </View>
                                                                        <View className="flex-1">
                                                                                <CText
                                                                                        size="lg"
                                                                                        weight="medium"
                                                                                        className={`mb-1 ${
                                                                                                selectedGoal ===
                                                                                                option.value
                                                                                                        ? 'text-tertiary'
                                                                                                        : 'text-text-light'
                                                                                        }`}
                                                                                >
                                                                                        {option.label}
                                                                                </CText>
                                                                                <CText
                                                                                        className={`text-sm ${
                                                                                                selectedGoal ===
                                                                                                option.value
                                                                                                        ? 'text-tertiary/80'
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
                        </ScrollView>
                </View>
        );
};
