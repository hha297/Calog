import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronDown } from 'lucide-react-native';
import { CText } from './CText';
import { Button } from './Button';
import { TextField } from './TextField';
import { Slider } from './Slider';
import { useTheme } from '../../contexts';
import { COLORS } from '../../style/color';

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
        onClose: () => void;
        onSave: () => void;
        loading?: boolean;
        disableSave?: boolean;
        children?: React.ReactNode;
}

export const EditModal: React.FC<EditModalProps> = ({
        visible,
        title,
        description,
        onClose,
        onSave,
        loading = false,
        disableSave = false,
        children,
}) => {
        const { isDark } = useTheme();

        return (
                <Modal
                        visible={visible}
                        animationType="fade"
                        transparent
                        statusBarTranslucent={true}
                        onRequestClose={onClose}
                >
                        <TouchableOpacity
                                className="flex-1 items-center justify-center bg-black/50 px-6"
                                activeOpacity={1}
                                onPress={onClose}
                        >
                                <TouchableOpacity
                                        className="w-full max-w-md rounded-xl bg-white dark:bg-surfacePrimary-dark"
                                        activeOpacity={1}
                                        onPress={(e) => e.stopPropagation()}
                                        style={{ maxHeight: '80%' }}
                                >
                                        {/* Header */}
                                        <View
                                                className={`flex-row items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-gray-200'} px-6 py-4`}
                                        >
                                                <TouchableOpacity onPress={onClose}>
                                                        <X
                                                                size={24}
                                                                color={isDark ? COLORS.ICON_LIGHT : COLORS.ICON_DARK}
                                                        />
                                                </TouchableOpacity>
                                                <CText size="lg" weight="bold" className="">
                                                        {title}
                                                </CText>
                                                <View style={{ width: 24 }} />
                                        </View>

                                        {/* Content */}
                                        <ScrollView className="px-6 py-4">
                                                {description && (
                                                        <CText className="mb-6 text-center">{description}</CText>
                                                )}

                                                {children}
                                        </ScrollView>

                                        {/* Footer */}
                                        <View
                                                className={`flex-row justify-between border-t ${isDark ? 'border-white/10' : 'border-gray-200'} p-6`}
                                        >
                                                <Button title="Cancel" onPress={onClose} variant="ghost" />
                                                <Button
                                                        title="Save"
                                                        onPress={onSave}
                                                        loading={loading}
                                                        disabled={disableSave}
                                                />
                                        </View>
                                </TouchableOpacity>
                        </TouchableOpacity>
                </Modal>
        );
};
