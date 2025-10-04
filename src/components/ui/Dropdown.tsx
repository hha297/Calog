import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import { CText } from './CText';
import { ChevronDown } from 'lucide-react-native';

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
                                className={`bg-surfacePrimary flex-row items-center justify-between rounded-lg border border-white/20 p-4 ${className} ${
                                        disabled ? 'opacity-50' : ''
                                }`}
                                onPress={handlePress}
                                disabled={disabled}
                        >
                                <CText className="text-text-light flex-1">{getSelectedLabel()}</CText>
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
                                                className="bg-surfacePrimary w-full max-w-sm rounded-xl"
                                                activeOpacity={1}
                                                onPress={(e) => e.stopPropagation()}
                                        >
                                                {/* Header */}
                                                <View className="border-b border-white/10 px-6 py-4">
                                                        <CText
                                                                size="lg"
                                                                weight="bold"
                                                                className="text-text-light text-center"
                                                        >
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
                                                                                        ? 'border-b border-white/10'
                                                                                        : ''
                                                                        }`}
                                                                        onPress={() => handleSelect(option.value)}
                                                                >
                                                                        <View>
                                                                                <CText
                                                                                        className={`text-center ${
                                                                                                value === option.value
                                                                                                        ? 'text-white'
                                                                                                        : 'text-text-light'
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
                                                                                                                : 'text-text-muted'
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
                                                <View className="border-t border-white/10 p-4">
                                                        <TouchableOpacity
                                                                className="rounded-lg bg-white/10 p-3"
                                                                onPress={handleClose}
                                                        >
                                                                <CText
                                                                        className="text-text-light text-center"
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
