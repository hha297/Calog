import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { CText } from '../ui/CText';
import { Slider } from '../ui/Slider';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts';

export interface BasicInfoViewProps {
        currentProfile: any;
        onValuesChange: (values: Record<string, any>) => void;
}

export const BasicInfoView: React.FC<BasicInfoViewProps> = ({ currentProfile, onValuesChange }) => {
        const { isDark } = useTheme();
        const [values, setValues] = useState<Record<string, any>>({});
        const [editField, setEditField] = useState<null | { key: 'weight' | 'age'; title: string }>(null);
        const [tempValue, setTempValue] = useState<string>('');

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

        const openEditModal = (key: 'weight' | 'age') => {
                const titleText = key === 'weight' ? 'Edit Weight (kg)' : 'Edit Age';
                setEditField({ key, title: titleText });
                const current = values[key] ?? (key === 'weight' ? 70 : 25);
                setTempValue(String(current));
        };

        const saveEditModal = () => {
                if (!editField) return;
                const numericValue = parseInt(tempValue, 10);
                if (!isNaN(numericValue)) {
                        handleValueChange(editField.key, numericValue);
                }
                setEditField(null);
        };

        return (
                <View>
                        {/* Gender */}
                        <View className="mb-6">
                                <CText className="mb-3" weight="medium">
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
                                                                        : `${isDark ? 'border-transparent bg-background-dark' : 'border-transparent bg-background'}`
                                                        }`}
                                                        onPress={() => handleValueChange('gender', option.value)}
                                                >
                                                        <CText
                                                                className={`text-center ${
                                                                        values.gender === option.value
                                                                                ? 'text-green-400'
                                                                                : ''
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
                                <CText className="mb-3" weight="medium">
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
                        <View className="flex-row">
                                <View className="mr-2 flex-1">
                                        <TouchableOpacity
                                                activeOpacity={0.9}
                                                onPress={() => openEditModal('weight')}
                                                className="mb-4 w-full rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark"
                                        >
                                                <CText className="mx-auto mb-3 pt-4" weight="medium">
                                                        Weight (kg)
                                                </CText>
                                                <View
                                                        className={`mb-2 rounded-lg ${isDark ? 'bg-background-dark' : 'bg-background'} p-4`}
                                                >
                                                        <View className="flex-row items-center justify-between">
                                                                <TouchableOpacity
                                                                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                                        onPress={() => {
                                                                                const currentValue =
                                                                                        values.weight || 70;
                                                                                const newValue = Math.max(
                                                                                        30,
                                                                                        currentValue - 1,
                                                                                );
                                                                                handleValueChange('weight', newValue);
                                                                        }}
                                                                >
                                                                        <CText className="text-xl" weight="bold">
                                                                                -
                                                                        </CText>
                                                                </TouchableOpacity>
                                                                <CText
                                                                        className={`text-lg ${isDark ? 'text-textPrimary-dark' : 'text-textPrimary'}`}
                                                                        weight="medium"
                                                                >
                                                                        {values.weight || 70}
                                                                </CText>
                                                                <TouchableOpacity
                                                                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                                        onPress={() => {
                                                                                const currentValue =
                                                                                        values.weight || 70;
                                                                                const newValue = Math.min(
                                                                                        200,
                                                                                        currentValue + 1,
                                                                                );
                                                                                handleValueChange('weight', newValue);
                                                                        }}
                                                                >
                                                                        <CText className="text-xl" weight="bold">
                                                                                +
                                                                        </CText>
                                                                </TouchableOpacity>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                </View>

                                {/* Age */}
                                <View className="ml-2 flex-1">
                                        <TouchableOpacity
                                                activeOpacity={0.9}
                                                onPress={() => openEditModal('age')}
                                                className="w-full rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark"
                                        >
                                                <CText className="mx-auto mb-3 pt-4" weight="medium">
                                                        Age
                                                </CText>
                                                <View
                                                        className={`mb-2 rounded-lg ${isDark ? 'bg-background-dark' : 'bg-background'} p-4`}
                                                >
                                                        <View className="flex-row items-center justify-between">
                                                                <TouchableOpacity
                                                                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                                        onPress={() => {
                                                                                const currentValue = values.age || 25;
                                                                                const newValue = Math.max(
                                                                                        10,
                                                                                        currentValue - 1,
                                                                                );
                                                                                handleValueChange('age', newValue);
                                                                        }}
                                                                >
                                                                        <CText className="text-xl" weight="bold">
                                                                                -
                                                                        </CText>
                                                                </TouchableOpacity>
                                                                <CText
                                                                        className={`text-lg ${isDark ? 'text-textPrimary-dark' : 'text-textPrimary'}`}
                                                                        weight="medium"
                                                                >
                                                                        {values.age || 25}
                                                                </CText>
                                                                <TouchableOpacity
                                                                        className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                                        onPress={() => {
                                                                                const currentValue = values.age || 25;
                                                                                const newValue = Math.min(
                                                                                        100,
                                                                                        currentValue + 1,
                                                                                );
                                                                                handleValueChange('age', newValue);
                                                                        }}
                                                                >
                                                                        <CText className="text-xl" weight="bold">
                                                                                +
                                                                        </CText>
                                                                </TouchableOpacity>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                </View>
                        </View>

                        {/* Inline edit modal */}
                        <Modal
                                visible={!!editField}
                                animationType="fade"
                                transparent
                                onRequestClose={() => setEditField(null)}
                        >
                                <TouchableOpacity
                                        className="flex-1 items-center justify-center bg-black/50 px-6"
                                        activeOpacity={1}
                                        onPress={() => setEditField(null)}
                                >
                                        <TouchableOpacity
                                                className="w-full max-w-md rounded-xl bg-white dark:bg-surfacePrimary-dark"
                                                activeOpacity={1}
                                                onPress={(e) => e.stopPropagation()}
                                                style={{ maxHeight: '80%' }}
                                        >
                                                <View
                                                        className={`flex-row items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-gray-200'} px-6 py-4`}
                                                >
                                                        <CText size="lg" weight="bold" className="">
                                                                {editField?.title}
                                                        </CText>
                                                        <View style={{ width: 24 }} />
                                                </View>
                                                <View className="px-6 py-4">
                                                        <TextField
                                                                label={editField?.title || ''}
                                                                keyboardType="numeric"
                                                                value={tempValue}
                                                                onChangeText={setTempValue}
                                                        />
                                                </View>
                                                <View
                                                        className={`flex-row justify-between border-t ${isDark ? 'border-white/10' : 'border-gray-200'} p-6`}
                                                >
                                                        <Button
                                                                title="Cancel"
                                                                onPress={() => setEditField(null)}
                                                                variant="ghost"
                                                        />
                                                        <Button title="Save" onPress={saveEditModal} />
                                                </View>
                                        </TouchableOpacity>
                                </TouchableOpacity>
                        </Modal>
                </View>
        );
};
