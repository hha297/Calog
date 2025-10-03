import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CText } from '../ui/CText';

export interface MeasurementsViewProps {
        formValues: Record<string, any>;
        setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export const MeasurementsView: React.FC<MeasurementsViewProps> = ({ formValues, setFormValues }) => {
        const measurements = [
                { key: 'neck', label: 'Neck', unit: 'cm', min: 20, max: 50 },
                { key: 'waist', label: 'Waist', unit: 'cm', min: 50, max: 150 },
                { key: 'hip', label: 'Hip', unit: 'cm', min: 70, max: 150 },
                { key: 'bicep', label: 'Bicep', unit: 'cm', min: 15, max: 50 },
                { key: 'thigh', label: 'Thigh', unit: 'cm', min: 30, max: 80 },
        ];

        return (
                <View>
                        {measurements.map((measurement) => (
                                <View key={measurement.key} className="mb-6">
                                        <CText className="text-text-light mb-3" weight="medium">
                                                {measurement.label} ({measurement.unit})
                                        </CText>
                                        <View className="bg-surfacePrimary mb-4 rounded-lg p-4">
                                                <View className="flex-row items-center justify-between">
                                                        <TouchableOpacity
                                                                className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                                onPress={() => {
                                                                        const currentValue =
                                                                                formValues[measurement.key] ||
                                                                                measurement.min;
                                                                        const newValue = Math.max(
                                                                                measurement.min,
                                                                                currentValue - 1,
                                                                        );
                                                                        setFormValues((prev) => ({
                                                                                ...prev,
                                                                                [measurement.key]: newValue,
                                                                        }));
                                                                }}
                                                        >
                                                                <CText className="text-text-light text-xl font-bold">
                                                                        -
                                                                </CText>
                                                        </TouchableOpacity>
                                                        <CText className="text-text-light text-lg font-medium">
                                                                {formValues[measurement.key] || measurement.min}
                                                        </CText>
                                                        <TouchableOpacity
                                                                className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
                                                                onPress={() => {
                                                                        const currentValue =
                                                                                formValues[measurement.key] ||
                                                                                measurement.min;
                                                                        const newValue = Math.min(
                                                                                measurement.max,
                                                                                currentValue + 1,
                                                                        );
                                                                        setFormValues((prev) => ({
                                                                                ...prev,
                                                                                [measurement.key]: newValue,
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
                        ))}
                </View>
        );
};
