import React from 'react';
import { View } from 'react-native';
import { CText } from '../ui/CText';
import { TextField } from '../ui/TextField';

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
                                <TextField
                                        key={measurement.key}
                                        label={`${measurement.label} (${measurement.unit})`}
                                        placeholder="Enter value"
                                        value={
                                                formValues[measurement.key]
                                                        ? formValues[measurement.key].toString()
                                                        : ''
                                        }
                                        onChangeText={(text) => {
                                                const numericValue = parseFloat(text);
                                                if (
                                                        !isNaN(numericValue) &&
                                                        numericValue >= measurement.min &&
                                                        numericValue <= measurement.max
                                                ) {
                                                        setFormValues((prev) => ({
                                                                ...prev,
                                                                [measurement.key]: numericValue,
                                                        }));
                                                } else if (text === '') {
                                                        setFormValues((prev) => ({
                                                                ...prev,
                                                                [measurement.key]: null,
                                                        }));
                                                }
                                        }}
                                        keyboardType="numeric"
                                        className="mb-4"
                                />
                        ))}
                </View>
        );
};
