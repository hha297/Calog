import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { DiaryScreen } from '../screens/DiaryScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CText } from '../components/ui/CText';
import { MainTabParamList } from '../types';
import LottieView from 'lottie-react-native';
import { BookOpenIcon, ChartNoAxesCombinedIcon, HeadphonesIcon, UserRoundIcon } from 'lucide-react-native';
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom floating action button with NativeWind
const FloatingActionButton = ({ onPress }: { onPress: () => void }) => {
        return (
                <TouchableOpacity
                        onPress={onPress}
                        className="absolute bottom-0 left-1/2 mx-auto h-[80px] w-[80px] -translate-x-1/2 items-center justify-center rounded-full border-8 border-secondary bg-tertiary shadow-xl shadow-tertiary/30"
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
        return (
                <Tab.Navigator
                        screenOptions={{
                                headerShown: false, // Hide all headers
                                tabBarActiveTintColor: '#4CAF50',
                                tabBarInactiveTintColor: '#FFFFFF',
                                tabBarStyle: {
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 72,
                                        paddingTop: 8,
                                        backgroundColor: '#1e3738',
                                        borderTopLeftRadius: 25,
                                        borderTopRightRadius: 25,
                                        borderTopWidth: 0,
                                        elevation: 15, // Android
                                        shadowColor: '#000', // iOS
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 10,
                                },
                                tabBarShowLabel: false,
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
                                                <CText
                                                        className={focused ? '!text-tertiary' : '!text-white'}
                                                        weight="medium"
                                                >
                                                        Diary
                                                </CText>
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
                                                <CText
                                                        className={focused ? '!text-tertiary' : '!text-white'}
                                                        weight="medium"
                                                >
                                                        Analytics
                                                </CText>
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
                                                <CText
                                                        className={focused ? '!text-tertiary' : '!text-white'}
                                                        weight="medium"
                                                >
                                                        Help
                                                </CText>
                                        ),
                                        tabBarShowLabel: true,
                                }}
                        />

                        {/* Profile Tab */}
                        <Tab.Screen
                                name="Profile"
                                component={ProfileScreen}
                                options={{
                                        title: 'Profile',
                                        tabBarIcon: ({ color, focused }) => (
                                                <View className="items-center justify-center">
                                                        <UserRoundIcon className="size-4" color={color} />
                                                </View>
                                        ),
                                        tabBarLabel: ({ focused }) => (
                                                <CText
                                                        className={focused ? '!text-tertiary' : '!text-white'}
                                                        weight="medium"
                                                >
                                                        Profile
                                                </CText>
                                        ),
                                        tabBarShowLabel: true,
                                }}
                        />
                </Tab.Navigator>
        );
};
