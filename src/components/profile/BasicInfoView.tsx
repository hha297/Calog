import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CText } from '../ui/CText';
import { Slider } from '../ui/Slider';

export interface BasicInfoViewProps {
        currentProfile: any;
        onValuesChange: (values: Record<string, any>) => void;
}

export const BasicInfoView: React.FC<BasicInfoViewProps> = ({ currentProfile, onValuesChange }) => {
        const [values, setValues] = useState<Record<string, any>>({});

        // Initialize values when component mounts
        useEffect(() => {
                if (currentProfile) {
                        const initialValues = {
                                gender: currentProfile.gender || 'male',
                                height: currentProfile.height || 170,
                                weight: currentProfile.weight || 70,
                                age: currentProfile.age || 25,
                        };
                        setValues(initialValues);
                        onValuesChange(initialValues);
                }
        }, [currentProfile, onValuesChange]);

        const handleValueChange = (key: string, value: string | number) => {
                const newValues = { ...values, [key]: value };
                setValues(newValues);
                onValuesChange(newValues);
        };

        return (
                <View>
                        {/* Gender */}
                        <View className="mb-6">
                                <CText className="text-text-light mb-3" weight="medium">
                                        Gender
                                </CText>
                                <View className="flex-row justify-between">
                                        {[
                                                { label: 'Male', value: 'male' },
                                                { label: 'Female', value: 'female' },
                                                { label: 'Other', value: 'other' },
                                        ].map((option) => (
                                                <TouchableOpacity
                                                        key={option.value}
                                                        className={`mx-1 flex-1 rounded-lg border px-4 py-3 ${
                                                                values.gender === option.value
                                                                        ? 'border-green-500 bg-green-500/20'
                                                                        : 'border-white/20 bg-white/10'
                                                        }`}
                                                        onPress={() => handleValueChange('gender', option.value)}
                                                >
                                                        <CText
                                                                className={`text-center ${
                                                                        values.gender === option.value
                                                                                ? 'text-green-400'
                                                                                : 'text-text-light'
                                                                }`}
                                                                weight="medium"
                                                        >
                                                                {option.label}
                                                        </CText>
                                                </TouchableOpacity>
                                        ))}
                                </View>
                        </View>

                        {/* Height */}
                        <View className="mb-6">
                                <CText className="text-text-light mb-3" weight="medium">
                                        Height (cm)
                                </CText>
                                <Slider
                                        type="height"
                                        value={values.height || 170}
                                        onValueChange={(value) => handleValueChange('height', value)}
                                        className=""
                                />
                        </View>

                        {/* Weight */}
                        <View>
                                <CText className="text-text-light mb-3" weight="medium">
                                        Weight (kg)
                                </CText>
                                <View className="bg-surfacePrimary mb-4 rounded-lg p-4">
                                        <View className="flex-row items-center justify-between">
                                                <TouchableOpacity
                                                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                        onPress={() => {
                                                                const currentValue = values.weight || 70;
                                                                const newValue = Math.max(30, currentValue - 1);
                                                                handleValueChange('weight', newValue);
                                                        }}
                                                >
                                                        <CText className="text-text-light text-xl font-bold">-</CText>
                                                </TouchableOpacity>
                                                <CText className="text-text-light text-lg font-medium">
                                                        {values.weight || 70}
                                                </CText>
                                                <TouchableOpacity
                                                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                        onPress={() => {
                                                                const currentValue = values.weight || 70;
                                                                const newValue = Math.min(200, currentValue + 1);
                                                                handleValueChange('weight', newValue);
                                                        }}
                                                >
                                                        <CText className="text-text-light text-xl font-bold">+</CText>
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        </View>

                        {/* Age */}
                        <View>
                                <CText className="text-text-light mb-3" weight="medium">
                                        Age
                                </CText>
                                <View className="bg-surfacePrimary mb-4 rounded-lg p-4">
                                        <View className="flex-row items-center justify-between">
                                                <TouchableOpacity
                                                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                        onPress={() => {
                                                                const currentValue = values.age || 25;
                                                                const newValue = Math.max(10, currentValue - 1);
                                                                handleValueChange('age', newValue);
                                                        }}
                                                >
                                                        <CText className="text-text-light text-xl font-bold">-</CText>
                                                </TouchableOpacity>
                                                <CText className="text-text-light text-lg font-medium">
                                                        {values.age || 25}
                                                </CText>
                                                <TouchableOpacity
                                                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                        onPress={() => {
                                                                const currentValue = values.age || 25;
                                                                const newValue = Math.min(100, currentValue + 1);
                                                                handleValueChange('age', newValue);
                                                        }}
                                                >
                                                        <CText className="text-text-light text-xl font-bold">+</CText>
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        </View>
                </View>
        );
};
