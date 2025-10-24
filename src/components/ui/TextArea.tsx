import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { CustomText } from './CustomText';
import { colors } from '../../style/colors';

// Types
export type TextAreaSize = 'large' | 'medium' | 'small';

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  size?: TextAreaSize;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  numberOfLines?: number;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Size configurations
const getSizeClasses = (size: TextAreaSize) => {
  switch (size) {
    case 'large':
      return 'px-4 py-4 text-base min-h-24';
    case 'medium':
      return 'px-4 py-3 text-sm min-h-20';
    case 'small':
      return 'px-3 py-2 text-sm min-h-16';
    default:
      return 'px-4 py-3 text-sm min-h-20';
  }
};

// State styles
const getStateClasses = (
  isFocused: boolean,
  hasValue: boolean,
  disabled: boolean,
  hasError: boolean,
) => {
  if (disabled) {
    return {
      container: 'border border-lightGray/30 opacity-50',
    };
  }

  if (hasError) {
    return {
      container: 'border border-error',
    };
  }

  if (isFocused) {
    return {
      container: 'border border-white',
    };
  }

  if (hasValue) {
    return {
      container: 'border border-lightGray/70',
    };
  }

  return {
    container: 'border border-lightGray/30',
  };
};

const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder = 'Placeholder',
  value,
  size = 'medium',
  errorMessage,
  disabled = false,
  className = '',
  numberOfLines = 4,
  onChangeText,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  const hasValue = internalValue.length > 0;
  const hasError = !!errorMessage;
  const stateClasses = getStateClasses(isFocused, hasValue, disabled, hasError);
  const sizeClasses = getSizeClasses(size);

  const containerClasses = `rounded-xl ${sizeClasses} ${stateClasses.container} ${className}`;

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
      onFocus?.();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChangeText = (text: string) => {
    if (!disabled) {
      setInternalValue(text);
      onChangeText?.(text);
    }
  };

  return (
    <View className="mb-4">
      {label && (
        <CustomText color="text-lightGray" className="mb-2">
          {label}
        </CustomText>
      )}

      <TextInput
        className={containerClasses}
        placeholder={placeholder}
        placeholderTextColor={colors.lightGray}
        value={internalValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        style={{
          color: colors.lightGray,
          textAlignVertical: 'top',
          fontFamily: 'SpaceGrotesk-Regular',
          fontSize: 14,
        }}
      />

      {hasError && errorMessage && (
        <CustomText color="text-error" className="text-sm mt-1">
          {errorMessage}
        </CustomText>
      )}
    </View>
  );
};

export default TextArea;
