import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { CText } from '../ui/CText';
import { TextField } from '../ui/TextField';
import { AlertCircle } from 'lucide-react-native';

export interface MeasurementsViewProps {
        formValues: Record<string, any>;
        setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
        onReviewLog?: () => void;
}

export const MeasurementsView: React.FC<MeasurementsViewProps> = ({ formValues, setFormValues, onReviewLog }) => {
        const measurements = [
                { key: 'neck', label: 'Neck', unit: 'cm', min: 20, max: 50 },
                { key: 'waist', label: 'Waist', unit: 'cm', min: 50, max: 150 },
                { key: 'hip', label: 'Hip', unit: 'cm', min: 70, max: 150 },
                { key: 'bicep', label: 'Bicep', unit: 'cm', min: 15, max: 60 },
                { key: 'thigh', label: 'Thigh', unit: 'cm', min: 30, max: 100 },
        ];

        const getValidationError = (measurement: any, value: any): string | null => {
                if (!value || value === '') return null;

                const numericValue = parseFloat(value.toString());
                if (isNaN(numericValue)) return null;

                if (numericValue < measurement.min || numericValue > measurement.max) {
                        return `Value must be between ${measurement.min} and ${measurement.max} ${measurement.unit}`;
                }

                return null;
        };

        return (
                <ScrollView className="flex-1">
                        <View>
                                {measurements.map((measurement) => {
                                        const currentValue = formValues[measurement.key];
                                        const error = getValidationError(measurement, currentValue);

                                        return (
                                                <View key={measurement.key}>
                                                        <TextField
                                                                label={`${measurement.label} (${measurement.unit})`}
                                                                placeholder="Enter value"
                                                                value={currentValue ? currentValue.toString() : ''}
                                                                onChangeText={(text) => {
                                                                        // Allow empty string
                                                                        if (text === '') {
                                                                                setFormValues((prev) => ({
                                                                                        ...prev,
                                                                                        [measurement.key]: null,
                                                                                }));
                                                                                return;
                                                                        }

                                                                        // Parse numeric value
                                                                        const numericValue = parseFloat(text);

                                                                        // Allow any numeric input while typing
                                                                        if (!isNaN(numericValue)) {
                                                                                setFormValues((prev) => ({
                                                                                        ...prev,
                                                                                        [measurement.key]: numericValue,
                                                                                }));
                                                                        }
                                                                }}
                                                                keyboardType="numeric"
                                                        />
                                                        {error && (
                                                                <View className="mt-2 flex-row items-center rounded-lg border border-status-error/80 bg-status-error/20 p-3">
                                                                        <AlertCircle size={16} color="#F44336" />
                                                                        <CText className="ml-2 text-xs !text-status-error">
                                                                                {error}
                                                                        </CText>
                                                                </View>
                                                        )}
                                                </View>
                                        );
                                })}

                                {/* Review Log Button - Centered below all measurements */}
                                {onReviewLog && (
                                        <View className="my-4 items-center">
                                                <TouchableOpacity onPress={onReviewLog}>
                                                        <CText className="!text-primary">Review measurement log</CText>
                                                </TouchableOpacity>
                                        </View>
                                )}
                        </View>
                </ScrollView>
        );
};
