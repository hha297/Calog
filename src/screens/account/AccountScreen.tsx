import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {
        User,
        Send,
        Star,
        Share2,
        Globe,
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
        LanguagesIcon,
} from 'lucide-react-native';
import { CText, Switcher } from '../../components/ui';

import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuthStore } from '../../store';

export const AccountScreen: React.FC = () => {
        const navigation = useNavigation();
        const { profile } = useUserProfile();
        const { user, logout } = useAuthStore();

        const [languageModalVisible, setLanguageModalVisible] = useState(false);
        const [selectedLanguage, setSelectedLanguage] = useState('EN');
        const [darkModeEnabled, setDarkModeEnabled] = useState(true);
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

        const handleLanguage = () => {
                setLanguageModalVisible(true);
        };

        const handleLanguageSelect = (language: string) => {
                setSelectedLanguage(language);
                setLanguageModalVisible(false);
                // TODO: Implement language change functionality
                console.log('Language changed to:', language);
        };

        const handleDarkMode = () => {
                setDarkModeEnabled(!darkModeEnabled);
                // TODO: Implement dark mode toggle
                console.log('Toggle dark mode', !darkModeEnabled);
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
                console.log('Delete data');
        };

        return (
                <SafeAreaView className="flex-1 bg-background">
                        <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
                                {/* User Info Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary">
                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
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
                                                                <CText
                                                                        size="lg"
                                                                        weight="bold"
                                                                        className="text-text-light mr-2"
                                                                >
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
                                                                                {user?.role
                                                                                        ? user.role

                                                                                                  .charAt(0)
                                                                                                  .toUpperCase() +
                                                                                          user.role.slice(1)
                                                                                        : 'Free'}
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                        <CText className="text-text-muted">
                                                                {user?.email || 'user@example.com'}
                                                        </CText>
                                                </View>
                                                <ArrowRightIcon size={20} color="#FFFFFF" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handleLogout}
                                        >
                                                <CreditCardIcon size={20} color="#4CAF50" />
                                                <CText className="ml-3 flex-1">Manage Subscription</CText>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
                                                <LockIcon size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Change Password</CText>
                                        </TouchableOpacity>
                                </View>

                                {/* App Settings Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary">
                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handleLanguage}
                                        >
                                                <LanguagesIcon size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Language</CText>
                                                <CText className="text-text-muted mr-2">{selectedLanguage}</CText>
                                                <ChevronRightIcon size={16} color="#9CA3AF" />
                                        </TouchableOpacity>

                                        <View className="flex-row items-center border-b border-white/10 p-4">
                                                <Sun size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Dark Mode</CText>
                                                <Switcher value={darkModeEnabled} onValueChange={setDarkModeEnabled} />
                                        </View>
                                        <View className="flex-row items-center p-4">
                                                <BellIcon size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Notifications</CText>
                                                <Switcher
                                                        value={notificationsEnabled}
                                                        onValueChange={setNotificationsEnabled}
                                                />
                                        </View>
                                </View>

                                {/* Community & Feedback Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary">
                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handleSendRequest}
                                        >
                                                <Send size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Send Request</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handleRateApp}
                                        >
                                                <Star size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Rate Calog</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className="flex-row items-center p-4"
                                                onPress={handleFollowSocial}
                                        >
                                                <Share2 size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Follow Calog</CText>
                                        </TouchableOpacity>
                                </View>
                                <View className="mb-6 rounded-xl bg-surfacePrimary">
                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handleTermsOfService}
                                        >
                                                <HelpCircle size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Terms of Use</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handlePrivacyPolicy}
                                        >
                                                <Shield size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Privacy Policy</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handleDeleteData}
                                        >
                                                <Trash2 size={20} color="#F44336" />
                                                <CText className="ml-3 flex-1 !text-status-error">Delete Account</CText>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
                                                <LogOut size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Sign Out</CText>
                                        </TouchableOpacity>
                                </View>
                        </ScrollView>

                        {/* Language Selection Modal */}
                        <Modal
                                visible={languageModalVisible}
                                transparent
                                animationType="fade"
                                onRequestClose={() => setLanguageModalVisible(false)}
                        >
                                <TouchableOpacity
                                        className="flex-1 items-center justify-center bg-black/50 px-6"
                                        activeOpacity={1}
                                        onPress={() => setLanguageModalVisible(false)}
                                >
                                        <TouchableOpacity
                                                className="w-full max-w-sm rounded-xl bg-surfacePrimary"
                                                activeOpacity={1}
                                                onPress={(e) => e.stopPropagation()}
                                        >
                                                {/* Header */}
                                                <View className="border-b border-white/10 px-6 py-4">
                                                        <CText
                                                                size="lg"
                                                                weight="bold"
                                                                className="text-text-light text-center"
                                                        >
                                                                Select Language
                                                        </CText>
                                                </View>

                                                {/* Language Options */}
                                                <View>
                                                        {[
                                                                // TODO: Create & Use API to get languages flag, name and code
                                                                { code: 'EN', name: 'English' },
                                                                { code: 'FI', name: 'Finnish' },
                                                                { code: 'VI', name: 'Vietnamese' },
                                                        ].map((language, index) => (
                                                                <TouchableOpacity
                                                                        key={language.code}
                                                                        className={`p-4 ${
                                                                                selectedLanguage === language.code
                                                                                        ? 'bg-primary'
                                                                                        : 'bg-transparent'
                                                                        } ${
                                                                                index !== 2
                                                                                        ? 'border-b border-white/10'
                                                                                        : ''
                                                                        }`}
                                                                        onPress={() =>
                                                                                handleLanguageSelect(language.code)
                                                                        }
                                                                >
                                                                        <View className="flex-row items-center justify-center">
                                                                                <CText
                                                                                        className={`text-center text-sm ${
                                                                                                selectedLanguage ===
                                                                                                language.code
                                                                                                        ? 'text-white/80'
                                                                                                        : 'text-text-muted'
                                                                                        }`}
                                                                                >
                                                                                        {/* TODO: Use Flag */}
                                                                                        {language.code}
                                                                                </CText>
                                                                                <CText className="px-2">-</CText>
                                                                                <CText
                                                                                        className={`text-center ${
                                                                                                selectedLanguage ===
                                                                                                language.code
                                                                                                        ? 'text-white'
                                                                                                        : 'text-text-light'
                                                                                        }`}
                                                                                        weight="medium"
                                                                                >
                                                                                        {language.name}
                                                                                </CText>
                                                                        </View>
                                                                </TouchableOpacity>
                                                        ))}
                                                </View>

                                                {/* Footer */}
                                                <View className="border-t border-white/10 p-4">
                                                        <TouchableOpacity
                                                                className="rounded-lg bg-white/10 p-3"
                                                                onPress={() => setLanguageModalVisible(false)}
                                                        >
                                                                <CText
                                                                        className="text-text-light text-center"
                                                                        weight="medium"
                                                                >
                                                                        Cancel
                                                                </CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </TouchableOpacity>
                                </TouchableOpacity>
                        </Modal>
                </SafeAreaView>
        );
};
