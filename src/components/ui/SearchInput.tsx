import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Search } from './icons';
import { colors } from '../../style/colors';

// Types
export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// State styles
const getStateClasses = (
  isFocused: boolean,
  hasValue: boolean,
  disabled: boolean,
) => {
  if (disabled) {
    return {
      container: 'border border-lightGray/30 opacity-50',
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

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value,
  disabled = false,
  className = '',
  onChangeText,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  const hasValue = internalValue.length > 0;
  const stateClasses = getStateClasses(isFocused, hasValue, disabled);

  const containerClasses = `rounded-xl px-4 flex-row items-center ${stateClasses.container} ${className}`;

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
      <View className={containerClasses}>
        <View className="mr-3">
          <Search width={16} height={16} color={colors.lightGray} />
        </View>

        <TextInput
          className="flex-1"
          placeholder={placeholder}
          placeholderTextColor={colors.lightGray}
          value={internalValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          style={{
            color: colors.lightGray,
            fontFamily: 'SpaceGrotesk-Regular',
            fontSize: 14,
          }}
        />
      </View>
    </View>
  );
};

export default SearchInput;
