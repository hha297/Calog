import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronDown } from 'lucide-react-native';
import { CText } from './CText';
import { Button } from './Button';
import { TextField } from './TextField';
import { Slider } from './Slider';

export interface EditModalField {
        key: string;
        label: string;
        type: 'text' | 'number' | 'select' | 'weight_goal' | 'gender_buttons' | 'slider' | 'stepper' | 'dual_stepper';
        value: string | number;
        placeholder?: string;
        options?: { label: string; value: string | number }[];
        unit?: string;
        min?: number;
        max?: number;
        step?: number;
        description?: string;
        fields?: { key: string; label: string; unit: string; min?: number; max?: number; step?: number }[];
}

export interface EditModalProps {
        visible: boolean;
        title: string;
        description?: string;
        fields: EditModalField[];
        onClose: () => void;
        onSave: (values: Record<string, any>) => void;
        loading?: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({
        visible,
        title,
        description,
        fields,
        onClose,
        onSave,
        loading = false,
}) => {
        const [values, setValues] = useState<Record<string, any>>({});
        const [selectedDropdowns, setSelectedDropdowns] = useState<Record<string, boolean>>({});

        // Initialize values when modal opens
        React.useEffect(() => {
                if (visible) {
                        const initialValues: Record<string, any> = {};
                        fields.forEach((field) => {
                                initialValues[field.key] = field.value;
                        });
                        setValues(initialValues);
                }
        }, [visible, fields]);

        const handleValueChange = (key: string, value: string | number) => {
                setValues((prev) => ({ ...prev, [key]: value }));
        };

        const toggleDropdown = (key: string) => {
                setSelectedDropdowns((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                }));
        };

        const selectOption = (fieldKey: string, optionValue: string | number) => {
                handleValueChange(fieldKey, optionValue);
                toggleDropdown(fieldKey);
        };

        const handleSave = () => {
                // Validate required fields
                const requiredFields = fields.filter((field) => !values[field.key]);
                if (requiredFields.length > 0) {
                        Alert.alert('Error', 'Please fill in all required fields');
                        return;
                }

                onSave(values);
        };

        const renderField = (field: EditModalField) => {
                switch (field.type) {
                        case 'text':
                                return (
                                        <View key={field.key} className="mb-4">
                                                <TextField
                                                        label={field.label}
                                                        value={values[field.key]?.toString() || ''}
                                                        onChangeText={(text) => handleValueChange(field.key, text)}
                                                        placeholder={field.placeholder || field.label}
                                                        className="mb-2"
                                                />
                                        </View>
                                );

                        case 'number':
                                return (
                                        <View key={field.key} className="mb-4">
                                                <View className="flex-row items-center justify-between">
                                                        <CText className="text-text-light mt-4" weight="medium">
                                                                {field.label}
                                                        </CText>
                                                        <View style={{ width: '60%' }}>
                                                                <TextField
                                                                        label=""
                                                                        value={values[field.key]?.toString() || ''}
                                                                        onChangeText={(text) => {
                                                                                const numValue = parseFloat(text) || 0;
                                                                                handleValueChange(field.key, numValue);
                                                                        }}
                                                                        placeholder={field.placeholder || '0'}
                                                                        keyboardType="numeric"
                                                                        className="text-center"
                                                                />
                                                        </View>
                                                </View>
                                        </View>
                                );

                        case 'select':
                                return (
                                        <View key={field.key} className="mb-4">
                                                <CText className="text-text-light mb-2" weight="medium">
                                                        {field.label}
                                                </CText>
                                                <TouchableOpacity
                                                        className="flex-row items-center justify-between rounded-lg border border-white/20 bg-white/10 px-4 py-3"
                                                        onPress={() => toggleDropdown(field.key)}
                                                >
                                                        <CText className="text-text-light">
                                                                {field.options?.find(
                                                                        (opt) => opt.value === values[field.key],
                                                                )?.label ||
                                                                        values[field.key]?.toString() ||
                                                                        'Select option'}
                                                        </CText>
                                                        <ChevronDown
                                                                size={20}
                                                                color="#9CA3AF"
                                                                style={{
                                                                        transform: [
                                                                                {
                                                                                        rotate: selectedDropdowns[
                                                                                                field.key
                                                                                        ]
                                                                                                ? '180deg'
                                                                                                : '0deg',
                                                                                },
                                                                        ],
                                                                }}
                                                        />
                                                </TouchableOpacity>

                                                {selectedDropdowns[field.key] && (
                                                        <View className="mt-1 max-h-40 rounded-lg border border-white/20 bg-white/10">
                                                                <ScrollView className="max-h-40">
                                                                        {field.options?.map((option) => (
                                                                                <TouchableOpacity
                                                                                        key={option.value.toString()}
                                                                                        className="border-b border-white/10 px-4 py-3 last:border-b-0"
                                                                                        onPress={() =>
                                                                                                selectOption(
                                                                                                        field.key,
                                                                                                        option.value,
                                                                                                )
                                                                                        }
                                                                                >
                                                                                        <CText className="text-text-light">
                                                                                                {option.label}
                                                                                        </CText>
                                                                                </TouchableOpacity>
                                                                        ))}
                                                                </ScrollView>
                                                        </View>
                                                )}
                                        </View>
                                );

                        case 'weight_goal':
                                return (
                                        <View key={field.key} className="mb-4">
                                                <CText className="text-text-light mb-2" weight="medium">
                                                        {field.label}
                                                </CText>
                                                <View className="rounded-lg border border-white/20 bg-white/10 p-4">
                                                        <View className="mb-2 flex-row items-center justify-between">
                                                                <CText className="text-text-muted">Target Weight</CText>
                                                                <View className="flex-row items-center">
                                                                        <View className="w-16">
                                                                                <TextField
                                                                                        label=""
                                                                                        value={
                                                                                                values[
                                                                                                        field.key
                                                                                                ]?.toString() || ''
                                                                                        }
                                                                                        onChangeText={(
                                                                                                text: string,
                                                                                        ) => {
                                                                                                const numValue =
                                                                                                        parseFloat(
                                                                                                                text,
                                                                                                        ) || 0;
                                                                                                handleValueChange(
                                                                                                        field.key,
                                                                                                        numValue,
                                                                                                );
                                                                                        }}
                                                                                        placeholder="0"
                                                                                        keyboardType="numeric"
                                                                                        className="text-center"
                                                                                />
                                                                        </View>
                                                                        <CText className="text-text-muted ml-2">
                                                                                kg
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                        {field.description && (
                                                                <CText className="text-text-muted text-sm">
                                                                        {field.description}
                                                                </CText>
                                                        )}
                                                </View>
                                        </View>
                                );

                        case 'gender_buttons':
                                return (
                                        <View key={field.key} className="mb-4">
                                                <CText className="text-text-light mb-2" weight="medium">
                                                        {field.label}
                                                </CText>
                                                <View className="flex-row space-x-2">
                                                        {field.options?.map((option) => (
                                                                <TouchableOpacity
                                                                        key={option.value.toString()}
                                                                        className={`flex-1 rounded-lg border px-4 py-3 ${
                                                                                values[field.key] === option.value
                                                                                        ? 'border-green-500 bg-green-500/20'
                                                                                        : 'border-white/20 bg-white/10'
                                                                        }`}
                                                                        onPress={() =>
                                                                                handleValueChange(
                                                                                        field.key,
                                                                                        option.value,
                                                                                )
                                                                        }
                                                                >
                                                                        <CText
                                                                                className={`text-center ${
                                                                                        values[field.key] ===
                                                                                        option.value
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
                                );

                        case 'slider':
                                // Determine slider type based on field key
                                const getSliderType = (key: string) => {
                                        if (key === 'height') return 'height';
                                        if (key === 'weight') return 'weight';
                                        if (key === 'age') return 'age';
                                        if (key === 'weightChangeRate') return 'weight_goal';
                                        return 'custom';
                                };

                                const sliderType = getSliderType(field.key);

                                return (
                                        <View key={field.key} className="mb-4">
                                                <Slider
                                                        type={sliderType as any}
                                                        value={values[field.key] || field.min || 0}
                                                        onValueChange={(value) => handleValueChange(field.key, value)}
                                                        className=""
                                                        customConfig={
                                                                sliderType === 'custom'
                                                                        ? {
                                                                                  minimumValue: field.min || 0,
                                                                                  maximumValue: field.max || 100,
                                                                                  step: field.step || 1,
                                                                          }
                                                                        : undefined
                                                        }
                                                />
                                        </View>
                                );

                        case 'stepper':
                                return (
                                        <View key={field.key} className="mb-4">
                                                <CText className="text-text-light mb-2" weight="medium">
                                                        {field.label}
                                                </CText>
                                                <View className="flex-row items-center justify-between">
                                                        <CText className="text-text-light">
                                                                {values[field.key] || field.min || 0} {field.unit}
                                                        </CText>
                                                        <View className="flex-row items-center">
                                                                <TouchableOpacity
                                                                        className="rounded-full bg-white/10 p-2"
                                                                        onPress={() => {
                                                                                const currentValue =
                                                                                        values[field.key] ||
                                                                                        field.min ||
                                                                                        0;
                                                                                const newValue = Math.max(
                                                                                        field.min || 0,
                                                                                        currentValue -
                                                                                                (field.step || 1),
                                                                                );
                                                                                handleValueChange(field.key, newValue);
                                                                        }}
                                                                >
                                                                        <CText className="text-text-light text-lg">
                                                                                -
                                                                        </CText>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity
                                                                        className="ml-2 rounded-full bg-white/10 p-2"
                                                                        onPress={() => {
                                                                                const currentValue =
                                                                                        values[field.key] ||
                                                                                        field.min ||
                                                                                        0;
                                                                                const newValue = Math.min(
                                                                                        field.max || 100,
                                                                                        currentValue +
                                                                                                (field.step || 1),
                                                                                );
                                                                                handleValueChange(field.key, newValue);
                                                                        }}
                                                                >
                                                                        <CText className="text-text-light text-lg">
                                                                                +
                                                                        </CText>
                                                                </TouchableOpacity>
                                                        </View>
                                                </View>
                                        </View>
                                );

                        case 'dual_stepper':
                                return (
                                        <View key={field.key} className="mb-4">
                                                <View className="flex-row">
                                                        {field.fields?.map((subField, index) => (
                                                                <View
                                                                        key={subField.key}
                                                                        className={`flex-1 ${index === 0 ? 'mr-2' : 'ml-2'}`}
                                                                >
                                                                        <CText
                                                                                className="text-text-light mb-2"
                                                                                weight="medium"
                                                                        >
                                                                                {subField.label}
                                                                        </CText>
                                                                        <View className="flex-row items-center justify-between">
                                                                                <CText className="text-text-light">
                                                                                        {values[subField.key] ||
                                                                                                subField.min ||
                                                                                                0}{' '}
                                                                                        {subField.unit}
                                                                                </CText>
                                                                                <View className="flex-row items-center">
                                                                                        <TouchableOpacity
                                                                                                className="rounded-full bg-white/10 p-2"
                                                                                                onPress={() => {
                                                                                                        const currentValue =
                                                                                                                values[
                                                                                                                        subField
                                                                                                                                .key
                                                                                                                ] ||
                                                                                                                subField.min ||
                                                                                                                0;
                                                                                                        const newValue =
                                                                                                                Math.max(
                                                                                                                        subField.min ||
                                                                                                                                0,
                                                                                                                        currentValue -
                                                                                                                                (subField.step ||
                                                                                                                                        1),
                                                                                                                );
                                                                                                        handleValueChange(
                                                                                                                subField.key,
                                                                                                                newValue,
                                                                                                        );
                                                                                                }}
                                                                                        >
                                                                                                <CText className="text-text-light text-lg">
                                                                                                        -
                                                                                                </CText>
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity
                                                                                                className="ml-2 rounded-full bg-white/10 p-2"
                                                                                                onPress={() => {
                                                                                                        const currentValue =
                                                                                                                values[
                                                                                                                        subField
                                                                                                                                .key
                                                                                                                ] ||
                                                                                                                subField.min ||
                                                                                                                0;
                                                                                                        const newValue =
                                                                                                                Math.min(
                                                                                                                        subField.max ||
                                                                                                                                100,
                                                                                                                        currentValue +
                                                                                                                                (subField.step ||
                                                                                                                                        1),
                                                                                                                );
                                                                                                        handleValueChange(
                                                                                                                subField.key,
                                                                                                                newValue,
                                                                                                        );
                                                                                                }}
                                                                                        >
                                                                                                <CText className="text-text-light text-lg">
                                                                                                        +
                                                                                                </CText>
                                                                                        </TouchableOpacity>
                                                                                </View>
                                                                        </View>
                                                                </View>
                                                        ))}
                                                </View>
                                        </View>
                                );

                        default:
                                return null;
                }
        };

        return (
                <Modal visible={visible} animationType="slide" transparent statusBarTranslucent={true}>
                        <View className="flex-1 justify-end">
                                <View className="bg-secondary" style={{ height: '60%' }}>
                                        {/* Header */}
                                        <View className="flex-row items-center justify-between border-b border-white/10 px-6 py-4">
                                                <TouchableOpacity onPress={onClose}>
                                                        <X size={24} color="#FFFFFF" />
                                                </TouchableOpacity>
                                                <CText size="lg" weight="bold" className="text-text-light">
                                                        {title}
                                                </CText>
                                                <View style={{ width: 24 }} />
                                        </View>

                                        {/* Content */}
                                        <ScrollView className="flex-1 px-6 py-4">
                                                {description && (
                                                        <CText className="mb-6 text-center">{description}</CText>
                                                )}

                                                {fields.map(renderField)}
                                        </ScrollView>

                                        {/* Footer */}
                                        <View className="flex-row justify-between border-t border-white/10 p-6">
                                                <Button title="Cancel" onPress={onClose} variant="secondary" />
                                                <Button title="Save" onPress={handleSave} loading={loading} />
                                        </View>
                                </View>
                        </View>
                </Modal>
        );
};
