import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {
        User,
        Send,
        Star,
        Share2,
        Sun,
        HelpCircle,
        Shield,
        Trash2,
        LogOut,
        FacebookIcon,
        InstagramIcon,
        LinkedinIcon,
        LockIcon,
        ArrowRightIcon,
        CreditCardIcon,
        BellIcon,
        ChevronRightIcon,
} from 'lucide-react-native';
import { CText, Switcher } from '../../components/ui';

import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuthStore } from '../../store';
import { useTheme } from '../../contexts';

export const AccountScreen: React.FC = () => {
        const navigation = useNavigation();
        const { profile } = useUserProfile();
        const { user, logout } = useAuthStore();
        const { colorScheme, colorSchemePreference, setColorScheme, isDark } = useTheme();

        // Border color for separators
        const separatorClass = isDark ? 'border-white/10' : 'border-gray-300';

        const [notificationsEnabled, setNotificationsEnabled] = useState(true);

        const handleLogout = async () => {
                try {
                        await logout();
                } catch (error) {
                        console.log('Logout error:', error);
                }
        };

        const handleProfile = () => {
                navigation.navigate('Profile' as never);
        };

        const handleSendRequest = () => {
                // TODO: Implement send request functionality
                console.log('Send request');
        };

        const handleRateApp = () => {
                // TODO: Implement rate app functionality
                console.log('Rate app');
        };

        const handleJoinCommunity = () => {
                // TODO: Implement join community functionality
                console.log('Join community');
        };

        const handleFollowSocial = () => {
                // TODO: Implement social media links
                console.log('Follow on social media');
        };

        const handleDarkModeToggle = (value: boolean) => {
                setColorScheme(value ? 'dark' : 'light');
        };

        const handleTermsOfService = () => {
                // TODO: Navigate to terms of service
                console.log('Terms of service');
        };

        const handlePrivacyPolicy = () => {
                // TODO: Navigate to privacy policy
                console.log('Privacy policy');
        };

        const handleDeleteData = () => {
                // TODO: Implement delete data functionality
        };

        return (
                <SafeAreaView className="flex-1 bg-background pt-4 dark:bg-background-dark">
                        <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
                                {/* User Info Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b-[0.5px] ${separatorClass} p-4`}
                                                onPress={handleProfile}
                                        >
                                                <View className="mr-4 size-16 items-center justify-center rounded-full bg-primary">
                                                        {user?.avatar ? (
                                                                <Image
                                                                        source={{ uri: user.avatar }}
                                                                        className="size-16 rounded-full"
                                                                />
                                                        ) : (
                                                                <User size={32} color="#FFFFFF" />
                                                        )}
                                                </View>
                                                <View className="flex-1">
                                                        <View className="mb-1 flex-row items-center">
                                                                <CText size="lg" weight="bold" className="mr-2">
                                                                        {user?.fullName || user?.name || 'User'}
                                                                </CText>
                                                                <View
                                                                        className={`rounded-full px-2 py-1 ${
                                                                                user?.role === 'premium'
                                                                                        ? 'bg-yellow-500'
                                                                                        : 'bg-primary'
                                                                        }`}
                                                                >
                                                                        <CText
                                                                                size="xs"
                                                                                weight="medium"
                                                                                className="text-white"
                                                                        >
                                                                                {user?.role === 'premium'
                                                                                        ? 'Premium'
                                                                                        : 'Free'}
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                        <CText className="">{user?.email || 'user@example.com'}</CText>
                                                </View>
                                                <ArrowRightIcon size={20} color="#FFFFFF" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b-[0.5px] ${separatorClass} p-4`}
                                                onPress={handleLogout}
                                        >
                                                <CreditCardIcon size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Manage Subscription</CText>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
                                                <LockIcon size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Change Password</CText>
                                        </TouchableOpacity>
                                </View>

                                {/* App Settings Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                        <View
                                                className={`flex-row items-center border-b-[0.5px] ${separatorClass} p-4`}
                                        >
                                                <Sun size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Dark Mode</CText>
                                                <Switcher value={isDark} onValueChange={handleDarkModeToggle} />
                                        </View>

                                        <View className="flex-row items-center p-4">
                                                <BellIcon size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Notifications</CText>
                                                <Switcher
                                                        value={notificationsEnabled}
                                                        onValueChange={setNotificationsEnabled}
                                                />
                                        </View>
                                </View>

                                {/* Community & Feedback Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b-[0.5px] ${separatorClass} p-4`}
                                                onPress={handleSendRequest}
                                        >
                                                <Send size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Send Request</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className={`flex-row items-center border-b-[0.5px] ${separatorClass} p-4`}
                                                onPress={handleRateApp}
                                        >
                                                <Star size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Rate Calog</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className="flex-row items-center p-4"
                                                onPress={handleFollowSocial}
                                        >
                                                <Share2 size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Follow Calog</CText>
                                        </TouchableOpacity>
                                </View>
                                <View className="mb-6 rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b-[0.5px] ${separatorClass} p-4`}
                                                onPress={handleTermsOfService}
                                        >
                                                <HelpCircle size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Terms of Use</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className={`flex-row items-center border-b-[0.5px] ${separatorClass} p-4`}
                                                onPress={handlePrivacyPolicy}
                                        >
                                                <Shield size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Privacy Policy</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className={`flex-row items-center border-b-[0.5px] ${separatorClass} p-4`}
                                                onPress={handleDeleteData}
                                        >
                                                <Trash2 size={20} color="#F44336" />
                                                <CText className="ml-3 flex-1 !text-status-error">Delete Account</CText>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
                                                <LogOut size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Sign Out</CText>
                                        </TouchableOpacity>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
