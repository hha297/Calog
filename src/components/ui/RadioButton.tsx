import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CustomText } from './CustomText';

// Types
export interface RadioButtonProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  onPress?: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
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

  const getRadioClasses = () => {
    if (disabled) {
      return checked
        ? 'w-5 h-5 rounded-full border border-lightGray/30 bg-primary opacity-50'
        : 'w-5 h-5 rounded-full border border-lightGray/30 opacity-50';
    }

    return checked
      ? 'w-5 h-5 rounded-full border border-lightGray/30 bg-primary'
      : 'w-5 h-5 rounded-full border border-lightGray/30';
  };

  const InnerCircle = () => (
    <View className="size-4 rounded-full border-2 border-black bg-primary" />
  );

  return (
    <TouchableOpacity
      className={`flex-row items-center ${className}`}
      onPress={handlePress}
      disabled={disabled}
    >
      <View className={`${getRadioClasses()} items-center justify-center`}>
        {checked && <InnerCircle />}
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

export default RadioButton;
