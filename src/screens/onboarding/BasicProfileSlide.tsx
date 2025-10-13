import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { CText } from '../../components/ui/CText';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { Dropdown } from '../../components/ui/Dropdown';
import { UserProfile } from '../../types';

interface BasicProfileSlideProps {
        onNext?: () => void;
        onDataChange?: (data: Partial<UserProfile>) => void;
        onValidationChange?: (isValid: boolean) => void;
        profileData?: Partial<UserProfile>;
}

const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
];

const activityLevels = [
        { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
        { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
        { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
        { value: 'active', label: 'Active', description: 'Heavy exercise 6-7 days/week' },
        { value: 'very_active', label: 'Very Active', description: 'Very heavy exercise, physical job' },
];

export const BasicProfileSlide: React.FC<BasicProfileSlideProps> = ({
        onNext,
        onDataChange,
        onValidationChange,
        profileData,
}) => {
        const [formData, setFormData] = useState({
                gender: profileData?.gender || '',
                age: profileData?.age?.toString() || '',
                height: profileData?.height?.toString() || '',
                weight: profileData?.weight?.toString() || '',
                activityLevel: profileData?.activityLevel || '',
        });

        const handleInputChange = (field: string, value: string) => {
                setFormData((prev) => ({ ...prev, [field]: value }));
                onDataChange?.({
                        ...profileData,
                        [field]:
                                field === 'age' || field === 'height' || field === 'weight'
                                        ? parseInt(value) || 0
                                        : value,
                });
        };

        const handleGenderSelect = (gender: string) => {
                setFormData((prev) => ({ ...prev, gender }));
                onDataChange?.({ ...profileData, gender: gender as any });
        };

        const handleActivitySelect = (activityLevel: string) => {
                setFormData((prev) => ({ ...prev, activityLevel }));
                onDataChange?.({ ...profileData, activityLevel: activityLevel as any });
        };

        const isFormValid =
                formData.gender && formData.age && formData.height && formData.weight && formData.activityLevel;

        // Notify parent component about validation state
        useEffect(() => {
                onValidationChange?.(!!isFormValid);
        }, [isFormValid, onValidationChange]);

        return (
                <View className="flex-1 bg-surfacePrimary px-8 pb-20 pt-8 dark:bg-background-dark">
                        <ScrollView
                                className="flex-1"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                        >
                                {/* Header */}
                                <View className="mb-8">
                                        <CText
                                                size="2xl"
                                                weight="bold"
                                                className="mb-2 text-center text-textPrimary dark:text-white"
                                        >
                                                Tell us about you
                                        </CText>
                                        <CText size="lg" className="text-center text-textSecondary dark:text-gray-300">
                                                We'll calculate your daily calorie needs based on this info.
                                        </CText>
                                </View>

                                {/* Gender Selection */}
                                <View className="mb-6">
                                        <CText
                                                size="base"
                                                weight="medium"
                                                className="mb-3 text-textPrimary dark:text-white"
                                        >
                                                Gender
                                        </CText>
                                        <Dropdown
                                                options={genderOptions}
                                                value={formData.gender}
                                                onValueChange={(value) => handleGenderSelect(value as string)}
                                                placeholder="Select Gender"
                                        />
                                </View>

                                {/* Age */}
                                <View className="mb-4">
                                        <TextField
                                                label="Age"
                                                placeholder="Enter your age"
                                                value={formData.age}
                                                onChangeText={(value) => handleInputChange('age', value)}
                                                keyboardType="numeric"
                                        />
                                </View>

                                {/* Height */}
                                <View className="mb-4">
                                        <TextField
                                                label="Height (cm)"
                                                placeholder="Enter your height"
                                                value={formData.height}
                                                onChangeText={(value) => handleInputChange('height', value)}
                                                keyboardType="numeric"
                                        />
                                </View>

                                {/* Weight */}
                                <View className="mb-6">
                                        <TextField
                                                label="Weight (kg)"
                                                placeholder="Enter your weight"
                                                value={formData.weight}
                                                onChangeText={(value) => handleInputChange('weight', value)}
                                                keyboardType="numeric"
                                        />
                                </View>

                                {/* Activity Level */}
                                <View className="mb-8">
                                        <CText
                                                size="base"
                                                weight="medium"
                                                className="mb-3 text-textPrimary dark:text-white"
                                        >
                                                Activity Level
                                        </CText>
                                        <Dropdown
                                                options={activityLevels}
                                                value={formData.activityLevel}
                                                onValueChange={(value) => handleActivitySelect(value as string)}
                                                placeholder="Select Activity Level"
                                        />
                                </View>
                        </ScrollView>
                </View>
        );
};
