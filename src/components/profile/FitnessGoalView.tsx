import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CText } from '../ui/CText';
import { Dropdown } from '../ui/Dropdown';

export interface FitnessGoalViewProps {
        formValues: Record<string, any>;
        setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export const FitnessGoalView: React.FC<FitnessGoalViewProps> = ({ formValues, setFormValues }) => {
        const activityLevels = [
                { label: 'Sedentary', value: 'sedentary', description: 'Little or no exercise' },
                { label: 'Light', value: 'light', description: 'Light exercise 1-3 days/week' },
                { label: 'Moderate', value: 'moderate', description: 'Moderate exercise 3-5 days/week' },
                { label: 'Active', value: 'active', description: 'Heavy exercise 6-7 days/week' },
                { label: 'Very Active', value: 'very_active', description: 'Very heavy exercise, physical job' },
        ];

        const goals = [
                { label: 'Maintain Weight', value: 'maintain' },
                { label: 'Lose Weight', value: 'lose' },
                { label: 'Gain Weight', value: 'gain' },
        ];

        const reductionRates = [
                { label: 'Slow', value: 0.25, description: '0.25 kg/week - Gradual weight loss, easier to maintain' },
                { label: 'Moderate', value: 0.5, description: '0.5 kg/week - Balanced approach, recommended for most' },
                { label: 'Fast', value: 0.75, description: '0.75 kg/week - Aggressive loss, requires strict diet' },
                { label: 'Very Fast', value: 1.0, description: '1 kg/week - Maximum loss, not recommended long-term' },
        ];

        return (
                <View>
                        {/* Activity Level */}
                        <View className="mb-6">
                                <CText className="text-text-light mb-3" weight="medium">
                                        Activity Level
                                </CText>
                                <Dropdown
                                        options={activityLevels}
                                        value={formValues.activityLevel}
                                        onValueChange={(value) =>
                                                setFormValues((prev) => ({
                                                        ...prev,
                                                        activityLevel: value,
                                                }))
                                        }
                                        placeholder="Select Activity Level"
                                />
                        </View>

                        {/* Goal */}
                        <View className="mb-6">
                                <CText className="text-text-light mb-3" weight="medium">
                                        Weight Goal
                                </CText>
                                <Dropdown
                                        options={goals}
                                        value={formValues.goal}
                                        onValueChange={(value) =>
                                                setFormValues((prev) => ({
                                                        ...prev,
                                                        goal: value,
                                                }))
                                        }
                                        placeholder="Select Goal"
                                />
                        </View>

                        {/* Target Weight (only show if goal is not maintain) */}
                        {formValues.goal !== 'maintain' && (
                                <View className="mb-6">
                                        <CText className="text-text-light mb-3" weight="medium">
                                                Target Weight (kg)
                                        </CText>
                                        <View className="bg-surfacePrimary rounded-lg p-4">
                                                <View className="flex-row items-center justify-between">
                                                        <TouchableOpacity
                                                                className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                                onPress={() => {
                                                                        const currentValue =
                                                                                formValues.targetWeight || 70;
                                                                        const newValue = Math.max(30, currentValue - 1);
                                                                        setFormValues((prev) => ({
                                                                                ...prev,
                                                                                targetWeight: newValue,
                                                                        }));
                                                                }}
                                                        >
                                                                <CText className="text-text-light text-xl font-bold">
                                                                        -
                                                                </CText>
                                                        </TouchableOpacity>
                                                        <CText className="text-text-light text-lg font-medium">
                                                                {formValues.targetWeight || 70}
                                                        </CText>
                                                        <TouchableOpacity
                                                                className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                                onPress={() => {
                                                                        const currentValue =
                                                                                formValues.targetWeight || 70;
                                                                        const newValue = Math.min(
                                                                                200,
                                                                                currentValue + 1,
                                                                        );
                                                                        setFormValues((prev) => ({
                                                                                ...prev,
                                                                                targetWeight: newValue,
                                                                        }));
                                                                }}
                                                        >
                                                                <CText className="text-text-light text-xl font-bold">
                                                                        +
                                                                </CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </View>
                                </View>
                        )}

                        {/* Weight Change Rate (only show if goal is lose or gain) */}
                        {(formValues.goal === 'lose' || formValues.goal === 'gain') && (
                                <View className="mb-6">
                                        <CText className="text-text-light mb-3" weight="medium">
                                                Weight Change Rate
                                        </CText>
                                        <Dropdown
                                                options={reductionRates}
                                                value={formValues.weightChangeRate}
                                                onValueChange={(value) =>
                                                        setFormValues((prev) => ({
                                                                ...prev,
                                                                weightChangeRate: value,
                                                        }))
                                                }
                                                placeholder="Select Reduction Rate"
                                        />
                                </View>
                        )}
                </View>
        );
};
