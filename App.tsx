/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/* eslint-disable */
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-primary-dark">
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-3xl font-bold text-primary-green mb-4">
          Chào mừng đến với Calog!
        </Text>
        <Text className="text-gray-300 text-center mb-8 text-lg">
          Ứng dụng ghi chép thông minh với giao diện hiện đại
        </Text>

        {/* Gradient Card */}
        <View className="bg-primary-green rounded-xl p-6 mb-6 w-full max-w-sm">
          <Text className="text-white text-center font-semibold text-lg">
            Calog - Ghi chép thông minh
          </Text>
          <Text className="text-white/90 text-center mt-2">
            Tổ chức cuộc sống của bạn một cách hiệu quả
          </Text>
        </View>

        {/* Color Palette Demo */}
        <View className="flex-row space-x-3 mb-6">
          <View className="bg-primary-darker w-12 h-12 rounded-full" />
          <View className="bg-primary-green w-12 h-12 rounded-full" />
          <View className="bg-primary-green-light w-12 h-12 rounded-full" />
          <View className="bg-primary-green-dark w-12 h-12 rounded-full" />
        </View>

        {/* Feature Cards */}
        <View className="w-full max-w-sm space-y-3">
          <View className="bg-primary-darker rounded-lg p-4">
            <Text className="text-primary-green font-semibold text-center">
              ✨ Giao diện hiện đại
            </Text>
          </View>
          <View className="bg-primary-darker rounded-lg p-4">
            <Text className="text-primary-green font-semibold text-center">
              🎨 Màu sắc hài hòa
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default App;
