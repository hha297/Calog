/**
 * Calog - Calorie Logging App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';

import React, { useState } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { CustomText } from './src/components/ui/CustomText';
import SplashScreen from './src/screens/SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <SplashScreen onFinish={handleSplashFinish} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-12 px-5 items-center">
        <CustomText
          size="4xl"
          weight="bold"
          color="text-white"
          className="mb-2"
        >
          Calog
        </CustomText>
        <CustomText size="base" color="text-lightGray">
          Calorie Logging Made Easy
        </CustomText>
      </View>

      {/* Content với NativeWind */}
      <View className="flex-1 p-5">
        <CustomText
          size="lg"
          weight="semibold"
          color="text-white"
          className="mb-4"
        >
          Design System Demo
        </CustomText>

        <CustomText size="base" color="text-lightGray" className="mb-6">
          This app uses NativeWind with SpaceGrotesk font
        </CustomText>

        {/* Color palette demo */}
        <View className="mb-6">
          <CustomText
            size="sm"
            weight="medium"
            color="text-white"
            className="mb-3"
          >
            Colors
          </CustomText>
          <View className="flex-row gap-3">
            <View className="w-10 h-10 rounded-lg bg-primary" />
            <View className="w-10 h-10 rounded-lg bg-accentPurple" />
            <View className="w-10 h-10 rounded-lg bg-accentYellow" />
            <View className="w-10 h-10 rounded-lg bg-accentOrange" />
          </View>
        </View>

        {/* Typography demo */}
        <View className="gap-2">
          <CustomText
            size="sm"
            weight="medium"
            color="text-white"
            className="mb-3"
          >
            Typography
          </CustomText>
          <CustomText size="4xl" weight="bold" color="text-white">
            Large Title
          </CustomText>
          <CustomText size="3xl" weight="bold" color="text-white">
            Title 1
          </CustomText>
          <CustomText size="lg" weight="semibold" color="text-white">
            Headline
          </CustomText>
          <CustomText size="base" color="text-lightGray">
            Body Text
          </CustomText>
          <CustomText size="sm" weight="semibold" color="text-lightGray">
            Caption
          </CustomText>
        </View>
      </View>
    </View>
  );
}

export default App;
