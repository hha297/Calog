import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { CustomText } from './CustomText';
import { ChevronDown } from './icons';
import { colors } from '../../style/colors';

// Types
export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  disabled?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
}

// State styles
const getStateClasses = (
  hasValue: boolean,
  disabled: boolean,
  isFocused: boolean,
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

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Text',
  options = [],
  value,
  disabled = false,
  className = '',
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const hasValue = !!selectedValue;
  const stateClasses = getStateClasses(hasValue, disabled, isFocused);

  const containerClasses = `rounded-xl px-4 py-3 flex-row items-center justify-between ${stateClasses.container} ${className}`;

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    if (!disabled) {
      setSelectedValue(optionValue);
      setIsOpen(false);
      setIsFocused(false);
      onSelect?.(optionValue);
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  return (
    <View className="mb-4">
      {label && (
        <CustomText color="text-lightGray" className="mb-2">
          {label}
        </CustomText>
      )}

      <TouchableOpacity
        className={containerClasses}
        onPress={handleToggle}
        disabled={disabled}
      >
        <CustomText
          className="text-sm"
          color={hasValue ? 'text-white' : 'text-lightGray'}
          style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 14 }}
        >
          {displayText}
        </CustomText>

        <View className="ml-2">
          <ChevronDown
            width={16}
            height={16}
            color={disabled ? colors.lightGray : colors.white}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-darkGray rounded-xl border border-lightGray w-80 max-h-60">
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-4 py-3 border-b border-lightGray last:border-b-0"
                  onPress={() => handleSelect(item.value)}
                >
                  <CustomText className="text-sm" color="text-white">
                    {item.label}
                  </CustomText>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Dropdown;
