import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import AntDesign from '@react-native-vector-icons/ant-design';
import { CText } from './CText';

interface TextFieldProps {
        label: string;
        placeholder?: string;
        value: string;
        onChangeText: (text: string) => void;
        secureTextEntry?: boolean;
        error?: string;
        keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        className?: string;
        style?: ViewStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
        label,
        placeholder,
        value,
        onChangeText,
        secureTextEntry = false,
        error,
        keyboardType = 'default',
        autoCapitalize = 'none',
        className = '',
        style,
}) => {
        const [isFocused, setIsFocused] = useState(false);
        const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

        return (
                <View style={style} className={`mb-4 ${className}`}>
                        <CText size="base" className="mb-2">
                                {label}
                        </CText>

                        <View className="relative">
                                <TextInput
                                        style={[{ fontFamily: 'SpaceGrotesk-Regular' } as TextStyle]}
                                        className={`font-space-grotesk rounded-lg border bg-surfacePrimary px-4 py-3 text-white ${
                                                isFocused ? 'border-primary' : 'border-gray-600'
                                        } ${error ? 'border-status-error' : ''}`}
                                        placeholder={placeholder}
                                        placeholderTextColor="#9E9E9E"
                                        value={value}
                                        onChangeText={onChangeText}
                                        secureTextEntry={secureTextEntry && !isSecureVisible}
                                        keyboardType={keyboardType}
                                        autoCapitalize={autoCapitalize}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                />

                                {secureTextEntry && (
                                        <TouchableOpacity
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                onPress={() => setIsSecureVisible(!isSecureVisible)}
                                        >
                                                {isSecureVisible ? (
                                                        <AntDesign name="eye" size={16} color="#9E9E9E" />
                                                ) : (
                                                        <AntDesign name="eye-invisible" size={16} color="#9E9E9E" />
                                                )}
                                        </TouchableOpacity>
                                )}
                        </View>

                        {error && (
                                <CText size="sm" className="mt-1 !text-status-error">
                                        {error}
                                </CText>
                        )}
                </View>
        );
};
