import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { CText } from '../../components/ui/CText';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
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
                <View className="flex-1 bg-primary px-8 pb-20 pt-8">
                        <ScrollView
                                className="flex-1"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                        >
                                {/* Header */}
                                <View className="mb-8">
                                        <CText size="2xl" weight="bold" className="text-text-light mb-2 text-center">
                                                Tell us about you
                                        </CText>
                                        <CText size="lg" className="text-text-muted text-center">
                                                We'll calculate your daily calorie needs based on this info.
                                        </CText>
                                </View>

                                {/* Gender Selection */}
                                <View className="mb-6">
                                        <CText size="base" weight="medium" className="text-text-light mb-3">
                                                Gender
                                        </CText>
                                        <View className="flex-row">
                                                {genderOptions.map((option) => (
                                                        <TouchableOpacity
                                                                key={option.value}
                                                                onPress={() => handleGenderSelect(option.value)}
                                                                className={`mr-2 flex-1 rounded-lg border-2 p-3 ${
                                                                        formData.gender === option.value
                                                                                ? 'border-tertiary bg-tertiary/10'
                                                                                : 'border-gray-300'
                                                                }`}
                                                        >
                                                                <CText
                                                                        className={`text-center ${
                                                                                formData.gender === option.value
                                                                                        ? 'text-tertiary'
                                                                                        : 'text-text-muted'
                                                                        }`}
                                                                >
                                                                        {option.label}
                                                                </CText>
                                                        </TouchableOpacity>
                                                ))}
                                        </View>
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
                                        <CText size="base" weight="medium" className="text-text-light mb-3">
                                                Activity Level
                                        </CText>
                                        {activityLevels.map((level) => (
                                                <TouchableOpacity
                                                        key={level.value}
                                                        onPress={() => handleActivitySelect(level.value)}
                                                        className={`mb-2 rounded-lg border-2 p-3 ${
                                                                formData.activityLevel === level.value
                                                                        ? 'border-tertiary bg-tertiary/10'
                                                                        : 'border-gray-300'
                                                        }`}
                                                >
                                                        <CText
                                                                className={`mb-1 ${
                                                                        formData.activityLevel === level.value
                                                                                ? 'text-tertiary'
                                                                                : 'text-text-light'
                                                                }`}
                                                                weight="medium"
                                                        >
                                                                {level.label}
                                                        </CText>
                                                        <CText
                                                                className={`text-sm ${
                                                                        formData.activityLevel === level.value
                                                                                ? 'text-tertiary/80'
                                                                                : 'text-text-muted'
                                                                }`}
                                                        >
                                                                {level.description}
                                                        </CText>
                                                </TouchableOpacity>
                                        ))}
                                </View>
                        </ScrollView>
                </View>
        );
};
