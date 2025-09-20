/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';

import { StatusBar, useColorScheme, View, Text, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

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
  return (
    <View className="flex-1 bg-primary">
      <View className="flex-1 justify-center items-center p-4">
       <Image
  source={require('./src/assets/images/logo.jpeg')}
  className="size-1/4"
/>
        

        {/* Gradient Card */}
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          className="rounded-xl p-6 mb-6 w-full max-w-sm"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Calog - Ghi chép thông minh
          </Text>
          <Text className="text-white/90 text-center mt-2">
            Tổ chức cuộc sống của bạn một cách hiệu quả
          </Text>
        </LinearGradient>

        {/* Color Palette Demo */}
        <View className="flex-row space-x-3 mb-6">
          <View className="bg-primary w-12 h-12 rounded-full" />
          <View className="bg-secondary w-12 h-12 rounded-full" />
          <View className="bg-tertiary w-12 h-12 rounded-full" />
          <View className="bg-accent w-12 h-12 rounded-full" />
        </View>

        {/* Feature Cards */}
        <View className="w-full max-w-sm space-y-3">
          <View className="bg-secondary rounded-lg p-4">
            <Text className="text-tertiary font-semibold text-center">
              ✨ Giao diện hiện đại
            </Text>
          </View>
          <View className="bg-secondary rounded-lg p-4">
            <Text className="text-tertiary font-semibold text-center">
              🎨 Màu sắc hài hòa
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default App;
