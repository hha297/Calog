import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { DiaryScreen } from '../screens/DiaryScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { AccountNavigator } from './AccountNavigator';
import { TranslatedText } from '../components/ui/TranslatedText';
import { MainTabParamList } from '../types';
import LottieView from 'lottie-react-native';
import { BookOpenIcon, ChartNoAxesCombinedIcon, HeadphonesIcon, UserRoundIcon } from 'lucide-react-native';
import { useTheme } from '../contexts';
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom floating action button with NativeWind
const FloatingActionButton = ({ onPress }: { onPress: () => void }) => {
        const { isDark } = useTheme();

        return (
                <TouchableOpacity
                        onPress={onPress}
                        className={`absolute bottom-0 left-1/2 mx-auto h-[80px] w-[80px] -translate-x-1/2 items-center justify-center rounded-full border-8 bg-primary ${
                                isDark ? 'border-surfacePrimary-dark' : 'border-surfacePrimary'
                        }`}
                >
                        <LottieView
                                source={require('../assets/images/scan.json')}
                                autoPlay
                                loop
                                style={{ width: 72, height: 72 }}
                        />
                </TouchableOpacity>
        );
};

export const MainNavigator: React.FC = () => {
        const { isDark } = useTheme();

        return (
                <Tab.Navigator
                        screenOptions={{
                                headerShown: false, // Hide all headers
                                tabBarActiveTintColor: '#4CAF50',
                                tabBarInactiveTintColor: isDark ? '#FFFFFF' : '#666666',
                                tabBarStyle: {
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 88,
                                        paddingTop: 16,
                                        backgroundColor: isDark ? '#222630' : '#FFFFFF',
                                        borderTopLeftRadius: 32,
                                        borderTopRightRadius: 32,
                                        borderTopWidth: 0,
                                        elevation: 15, // Android
                                        shadowColor: '#000', // iOS
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                },
                                tabBarShowLabel: true,
                        }}
                >
                        {/* Diary Tab */}
                        <Tab.Screen
                                name="Diary"
                                component={DiaryScreen}
                                options={{
                                        title: 'Diary',
                                        tabBarIcon: ({ color, focused }) => (
                                                <View className="items-center justify-center">
                                                        <BookOpenIcon className="size-4" color={color} />
                                                </View>
                                        ),
                                        tabBarLabel: ({ focused }) => (
                                                <TranslatedText
                                                        text="diary"
                                                        staticKey={true}
                                                        className={`${focused ? '!text-primary' : isDark ? '!text-white' : '!text-textSecondary'} mt-1`}
                                                        weight="medium"
                                                        size="sm"
                                                />
                                        ),
                                        tabBarShowLabel: true,
                                }}
                        />

                        {/* Analytics Tab */}
                        <Tab.Screen
                                name="Analytics"
                                component={AnalyticsScreen}
                                options={{
                                        title: 'Analytics',
                                        tabBarIcon: ({ color, focused }) => (
                                                <View className="items-center justify-center">
                                                        <ChartNoAxesCombinedIcon className="size-4" color={color} />
                                                </View>
                                        ),
                                        tabBarLabel: ({ focused }) => (
                                                <TranslatedText
                                                        text="analytics"
                                                        staticKey={true}
                                                        className={`${focused ? '!text-primary' : isDark ? '!text-white' : '!text-textSecondary'} mt-1`}
                                                        weight="medium"
                                                        size="sm"
                                                />
                                        ),
                                        tabBarShowLabel: true,
                                }}
                        />

                        {/* Scan Tab (Floating Action Button) */}
                        <Tab.Screen
                                name="Scan"
                                component={ScanScreen}
                                options={({ navigation }) => ({
                                        title: 'Scan',
                                        tabBarIcon: () => null,
                                        tabBarLabel: () => null,
                                        tabBarButton: () => (
                                                <FloatingActionButton onPress={() => navigation.navigate('Scan')} />
                                        ),
                                })}
                        />

                        {/* Help Tab */}
                        <Tab.Screen
                                name="Help"
                                component={HelpScreen}
                                options={{
                                        title: 'Help',
                                        tabBarIcon: ({ color, focused }) => (
                                                <View className="items-center justify-center">
                                                        <HeadphonesIcon className="size-4" color={color} />
                                                </View>
                                        ),
                                        tabBarLabel: ({ focused }) => (
                                                <TranslatedText
                                                        text="help"
                                                        staticKey={true}
                                                        className={`${focused ? '!text-primary' : isDark ? '!text-white' : '!text-textSecondary'} mt-1`}
                                                        weight="medium"
                                                        size="sm"
                                                />
                                        ),
                                        tabBarShowLabel: true,
                                }}
                        />

                        {/* Account Tab */}
                        <Tab.Screen
                                name="Account"
                                component={AccountNavigator}
                                options={{
                                        title: 'Account',
                                        tabBarIcon: ({ color, focused }) => (
                                                <View className="items-center justify-center">
                                                        <UserRoundIcon className="size-4" color={color} />
                                                </View>
                                        ),
                                        tabBarLabel: ({ focused }) => (
                                                <TranslatedText
                                                        text="account"
                                                        staticKey={true}
                                                        className={`${focused ? '!text-primary' : isDark ? '!text-white' : '!text-textSecondary'} mt-1`}
                                                        weight="medium"
                                                        size="sm"
                                                />
                                        ),
                                        tabBarShowLabel: true,
                                }}
                        />
                </Tab.Navigator>
        );
};
