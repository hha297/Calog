import React from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';
import { CustomText } from './CustomText';
import { colors } from '../../style/colors';

// Types
export type SwitchSize = 'default' | 'small';

export interface SwitchProps {
  value?: boolean;
  disabled?: boolean;
  size?: SwitchSize;
  label?: string;
  className?: string;
  onValueChange?: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({
  value = false,
  disabled = false,
  size = 'default',
  label,
  className = '',
  onValueChange,
}) => {
  const thumbPosition = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  const trackColor = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(thumbPosition, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(trackColor, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value, thumbPosition, trackColor]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange?.(!value);
    }
  };

  const getTrackStyle = () => {
    const trackWidth = size === 'small' ? 32 : 48;
    const trackHeight = size === 'small' ? 16 : 24;

    const backgroundColor = trackColor.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.mediumGray, colors.primary],
    });

    return {
      width: trackWidth,
      height: trackHeight,
      borderRadius: trackHeight / 2,
      backgroundColor: disabled ? colors.mediumGray : backgroundColor,
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getThumbStyle = () => {
    const trackWidth = size === 'small' ? 32 : 48;
    const trackHeight = size === 'small' ? 16 : 24;
    const thumbSize = size === 'small' ? 12 : 20;

    const translateX = thumbPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [2, trackWidth - thumbSize - 2], // 2px margin on each side
    });

    return {
      width: thumbSize,
      height: thumbSize,
      borderRadius: thumbSize / 2,
      backgroundColor: colors.white,
      transform: [{ translateX }],
      marginTop: (trackHeight - thumbSize) / 2 + 0.2,
    };
  };

  return (
    <View className={`flex-row items-center ${className}`}>
      <TouchableOpacity onPress={handlePress} disabled={disabled}>
        <Animated.View style={getTrackStyle()}>
          <Animated.View style={getThumbStyle()} />
        </Animated.View>
      </TouchableOpacity>

      {label && (
        <CustomText
          color="text-white"
          className="ml-3"
          style={{ fontFamily: 'SpaceGrotesk-Regular', fontSize: 14 }}
        >
          {label}
        </CustomText>
      )}
    </View>
  );
};

export default Switch;
