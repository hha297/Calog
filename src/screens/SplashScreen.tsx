import React, { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { CustomText } from '../components/ui/CustomText';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start spinning animation
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    );

    spin.start();

    // Hide splash after 3 seconds
    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000);

    return () => {
      spin.stop();
      clearTimeout(timer);
    };
  }, [spinValue, onFinish]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-1 bg-background items-center justify-center">
      {/* Spinning Logo */}
      <Animated.View
        style={{
          transform: [{ rotate: spin }],
        }}
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={{
            width: 100,
            height: 100,
          }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Loading text */}
      <CustomText size="2xl" weight="bold" color=" py-4 text-primary">
        LOADING...
      </CustomText>
    </View>
  );
};

export default SplashScreen;
