import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CustomText } from './CustomText';
import { Tick } from './icons';
import { colors } from '../../style/colors';

// Types
export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  onPress?: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  disabled = false,
  label,
  className = '',
  onPress,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onPress?.();
    }
  };

  const getCheckboxClasses = () => {
    if (disabled) {
      return checked
        ? 'w-5 h-5 rounded border border-lightGray/30 bg-lightGray/30 opacity-50'
        : 'w-5 h-5 rounded border border-lightGray/30 opacity-50';
    }

    return checked
      ? 'w-5 h-5 rounded border border-primary bg-primary'
      : 'w-5 h-5 rounded border border-lightGray/30';
  };

  const TickIcon = () => (
    <View className="items-center justify-center">
      <Tick width={10} height={10} color={colors.white} />
    </View>
  );

  return (
    <TouchableOpacity
      className={`flex-row items-center ${className}`}
      onPress={handlePress}
      disabled={disabled}
    >
      <View className={`${getCheckboxClasses()} items-center justify-center`}>
        {checked && <TickIcon />}
      </View>

      {label && (
        <CustomText
          color="text-white"
          className="ml-3"
          style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 14 }}
        >
          {label}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
