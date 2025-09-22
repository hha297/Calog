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
                        <View className="flex-1 items-center justify-center p-4">
                                <Image source={require('./src/assets/images/logo.png')} className="size-40" />

                                {/* Gradient Card */}

                                <LinearGradient
                                        colors={['#4CAF50', '#2E7D32']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        className="mb-6 w-full max-w-sm rounded-xl p-6"
                                >
                                        <Text className="text-center text-lg font-semibold text-white">
                                                Calog - Ghi chép thông minh
                                        </Text>
                                        <Text className="mt-2 text-center text-white/90">
                                                Tổ chức cuộc sống của bạn một cách hiệu quả
                                        </Text>
                                </LinearGradient>

                                {/* Color Palette Demo */}
                                <View className="mb-6 flex-row space-x-3">
                                        <View className="h-12 w-12 rounded-full bg-primary" />
                                        <View className="h-12 w-12 rounded-full bg-secondary" />
                                        <View className="h-12 w-12 rounded-full bg-tertiary" />
                                        <View className="h-12 w-12 rounded-full bg-accent" />
                                </View>

                                {/* Feature Cards */}
                                <View className="w-full max-w-sm space-y-3">
                                        <View className="rounded-lg bg-secondary p-4">
                                                <Text className="text-center font-semibold text-tertiary">
                                                        ✨ Giao diện hiện đại
                                                </Text>
                                        </View>
                                        <View className="rounded-lg bg-secondary p-4">
                                                <Text className="text-center font-semibold text-tertiary">
                                                        🎨 Màu sắc hài hòa
                                                </Text>
                                        </View>
                                </View>
                        </View>
                </View>
        );
}

export default App;
