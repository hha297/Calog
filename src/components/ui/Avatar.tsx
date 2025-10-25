import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { OutlineCamera } from '../../assets/icons/icons';
import { colors } from '../../style/colors';

// Types
export interface AvatarProps {
  source?: { uri: string } | number;
  fallback?: string;
  editable?: boolean;
  className?: string;
  onPress?: () => void;
  onEditPress?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  fallback,
  editable = false,
  className = '',
  onPress,
  onEditPress,
}) => {
  const getFallbackContent = () => {
    if (fallback) {
      return (
        <View
          className={`${className} rounded-full bg-lightGray items-center justify-center`}
        >
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.mediumGray }}
          >
            {fallback.toUpperCase()}
          </Text>
        </View>
      );
    }

    // Default placeholder - use placeholder.png asset
    return (
      <Image
        source={require('../../assets/images/placeholder.png')}
        className={`${className} rounded-full`}
        resizeMode="cover"
      />
    );
  };

  const renderAvatar = () => {
    if (source) {
      return (
        <Image
          source={source}
          className={`${className} rounded-full`}
          resizeMode="cover"
        />
      );
    }

    return getFallbackContent();
  };

  return (
    <View className="relative">
      <TouchableOpacity
        className={className}
        onPress={onPress}
        disabled={!onPress}
      >
        {renderAvatar()}

        {editable && (
          <TouchableOpacity
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary items-center justify-center"
            onPress={onEditPress}
          >
            <OutlineCamera width={16} height={16} color={colors.white} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Avatar;
