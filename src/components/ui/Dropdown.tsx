import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import { CText } from './CText';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../contexts';

export interface DropdownOption {
        label: string;
        value: string | number;
        description?: string;
}

export interface DropdownProps {
        options: DropdownOption[];
        value: string | number;
        onValueChange: (value: string | number) => void;
        placeholder?: string;
        className?: string;
        disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
        options,
        value,
        onValueChange,
        placeholder = 'Select option',
        className = '',
        disabled = false,
}) => {
        const { isDark } = useTheme();
        const [isOpen, setIsOpen] = useState(false);

        const getSelectedLabel = () => {
                const selectedOption = options.find((option) => option.value === value);
                return selectedOption?.label || placeholder;
        };

        const handlePress = () => {
                if (disabled) return;
                setIsOpen(true);
        };

        const handleSelect = (selectedValue: string | number) => {
                onValueChange(selectedValue);
                setIsOpen(false);
        };

        const handleClose = () => {
                setIsOpen(false);
        };

        return (
                <>
                        <TouchableOpacity
                                className={`flex-row items-center justify-between rounded-lg ${isDark ? 'bg-surfacePrimary-dark' : 'bg-background'} p-4 ${className} ${
                                        disabled ? 'opacity-50' : ''
                                }`}
                                onPress={handlePress}
                                disabled={disabled}
                        >
                                <CText className={`flex-1 ${isDark ? 'text-textPrimary-dark' : 'text-textPrimary'}`}>
                                        {getSelectedLabel()}
                                </CText>
                                <ChevronDown
                                        size={20}
                                        color="#9CA3AF"
                                        style={{
                                                transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                                        }}
                                />
                        </TouchableOpacity>

                        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
                                <TouchableOpacity
                                        className="flex-1 items-center justify-center bg-black/50 px-6"
                                        activeOpacity={1}
                                        onPress={handleClose}
                                >
                                        <TouchableOpacity
                                                className="w-full max-w-sm rounded-xl bg-white dark:bg-surfacePrimary-dark"
                                                activeOpacity={1}
                                                onPress={(e) => e.stopPropagation()}
                                        >
                                                {/* Header */}
                                                <View
                                                        className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'} px-6 py-4`}
                                                >
                                                        <CText size="lg" weight="bold" className="text-center">
                                                                Select Option
                                                        </CText>
                                                </View>

                                                {/* Options */}
                                                <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
                                                        {options.map((option, index) => (
                                                                <TouchableOpacity
                                                                        key={option.value}
                                                                        className={`p-4 ${
                                                                                value === option.value
                                                                                        ? 'bg-primary'
                                                                                        : 'bg-transparent'
                                                                        } ${
                                                                                index !== options.length - 1
                                                                                        ? `border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`
                                                                                        : ''
                                                                        }`}
                                                                        onPress={() => handleSelect(option.value)}
                                                                >
                                                                        <View>
                                                                                <CText
                                                                                        className={`text-center ${
                                                                                                value === option.value
                                                                                                        ? 'text-white'
                                                                                                        : ''
                                                                                        }`}
                                                                                        weight="medium"
                                                                                >
                                                                                        {option.label}
                                                                                </CText>
                                                                                {option.description && (
                                                                                        <CText
                                                                                                className={`mt-1 text-center text-sm ${
                                                                                                        value ===
                                                                                                        option.value
                                                                                                                ? 'text-white/80'
                                                                                                                : ''
                                                                                                }`}
                                                                                        >
                                                                                                {option.description}
                                                                                        </CText>
                                                                                )}
                                                                        </View>
                                                                </TouchableOpacity>
                                                        ))}
                                                </ScrollView>

                                                {/* Footer */}
                                                <View
                                                        className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'} p-4`}
                                                >
                                                        <TouchableOpacity
                                                                className={`rounded-lg ${isDark ? 'bg-white/10' : 'border border-gray-300 bg-surfacePrimary'} p-3`}
                                                                onPress={handleClose}
                                                        >
                                                                <CText
                                                                        className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}
                                                                        weight="medium"
                                                                >
                                                                        Cancel
                                                                </CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </TouchableOpacity>
                                </TouchableOpacity>
                        </Modal>
                </>
        );
};
