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
        LanguagesIcon,
} from 'lucide-react-native';
import { CText, Switcher, TranslatedText } from '../../components/ui';

import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuthStore } from '../../store';
import { useTheme, useLanguage, LANGUAGE_NAMES } from '../../contexts';
import { getStaticTranslation } from '../../utils/translations';

export const AccountScreen: React.FC = () => {
        const navigation = useNavigation();
        const { profile } = useUserProfile();
        const { user, logout } = useAuthStore();
        const { colorScheme, colorSchemePreference, setColorScheme, isDark } = useTheme();
        const { currentLanguage, setLanguage } = useLanguage();

        // Border color for separators
        const separatorClass = isDark ? 'border-white/10' : 'border-gray-200';

        const [languageModalVisible, setLanguageModalVisible] = useState(false);
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

        const handleLanguageSelect = async (language: 'en' | 'fi' | 'vi') => {
                try {
                        await setLanguage(language);
                        setLanguageModalVisible(false);
                } catch (error) {
                        console.error('Error changing language:', error);
                }
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
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
                                {/* User Info Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b ${separatorClass} p-4`}
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
                                                                        <TranslatedText
                                                                                text={
                                                                                        user?.role === 'premium'
                                                                                                ? 'premium'
                                                                                                : 'free'
                                                                                }
                                                                                staticKey={true}
                                                                                size="xs"
                                                                                weight="medium"
                                                                                className="text-white"
                                                                        />
                                                                </View>
                                                        </View>
                                                        <CText className="">{user?.email || 'user@example.com'}</CText>
                                                </View>
                                                <ArrowRightIcon size={20} color="#FFFFFF" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b ${separatorClass} p-4`}
                                                onPress={handleLogout}
                                        >
                                                <CreditCardIcon size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="manageSubscription"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
                                                <LockIcon size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="changePassword"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                        </TouchableOpacity>
                                </View>

                                {/* App Settings Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b ${separatorClass} p-4`}
                                                onPress={handleLanguage}
                                        >
                                                <LanguagesIcon size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="language"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                                <CText className="mr-2 text-textSecondary dark:text-textSecondary-dark">
                                                        {LANGUAGE_NAMES[currentLanguage]}
                                                </CText>
                                                <ChevronRightIcon size={16} color="#9CA3AF" />
                                        </TouchableOpacity>
                                        <View className={`flex-row items-center border-b ${separatorClass} p-4`}>
                                                <Sun size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="darkMode"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                                <Switcher value={isDark} onValueChange={handleDarkModeToggle} />
                                        </View>

                                        <View className="flex-row items-center p-4">
                                                <BellIcon size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="notifications"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                                <Switcher
                                                        value={notificationsEnabled}
                                                        onValueChange={setNotificationsEnabled}
                                                />
                                        </View>
                                </View>

                                {/* Community & Feedback Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b ${separatorClass} p-4`}
                                                onPress={handleSendRequest}
                                        >
                                                <Send size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="sendRequest"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className={`flex-row items-center border-b ${separatorClass} p-4`}
                                                onPress={handleRateApp}
                                        >
                                                <Star size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="rateApp"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className="flex-row items-center p-4"
                                                onPress={handleFollowSocial}
                                        >
                                                <Share2 size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="followCalog"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                        </TouchableOpacity>
                                </View>
                                <View className="mb-6 rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                        <TouchableOpacity
                                                className={`flex-row items-center border-b ${separatorClass} p-4`}
                                                onPress={handleTermsOfService}
                                        >
                                                <HelpCircle size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="termsOfUse"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className={`flex-row items-center border-b ${separatorClass} p-4`}
                                                onPress={handlePrivacyPolicy}
                                        >
                                                <Shield size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="privacyPolicy"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className={`flex-row items-center border-b ${separatorClass} p-4`}
                                                onPress={handleDeleteData}
                                        >
                                                <Trash2 size={20} color="#F44336" />
                                                <TranslatedText
                                                        text="deleteAccount"
                                                        staticKey={true}
                                                        className="ml-3 flex-1 !text-status-error"
                                                />
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
                                                <LogOut size={20} color="#4CAF50" />
                                                <TranslatedText
                                                        text="signOut"
                                                        staticKey={true}
                                                        className="ml-3 flex-1"
                                                />
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
                                                className="w-full max-w-sm rounded-xl bg-surfacePrimary dark:bg-surfacePrimary-dark"
                                                activeOpacity={1}
                                                onPress={(e) => e.stopPropagation()}
                                        >
                                                {/* Header */}
                                                <View className={`border-b ${separatorClass} px-6 py-4`}>
                                                        <TranslatedText
                                                                text="selectLanguage"
                                                                staticKey={true}
                                                                size="lg"
                                                                weight="bold"
                                                                className="text-center"
                                                        />
                                                </View>

                                                {/* Language Options */}
                                                <View>
                                                        {[
                                                                { code: 'en' as const, flag: '🇬🇧', name: 'English' },
                                                                { code: 'fi' as const, flag: '🇫🇮', name: 'Suomi' },
                                                                { code: 'vi' as const, flag: '🇻🇳', name: 'Tiếng Việt' },
                                                        ].map((language, index) => (
                                                                <TouchableOpacity
                                                                        key={language.code}
                                                                        className={`p-4 ${
                                                                                currentLanguage === language.code
                                                                                        ? 'bg-primary'
                                                                                        : 'bg-transparent'
                                                                        } ${
                                                                                index !== 2
                                                                                        ? `border-b ${separatorClass}`
                                                                                        : ''
                                                                        }`}
                                                                        onPress={() =>
                                                                                handleLanguageSelect(language.code)
                                                                        }
                                                                >
                                                                        <View className="items-center justify-center">
                                                                                {/* Flag */}
                                                                                <CText
                                                                                        className={`mb-1 text-center text-xl ${
                                                                                                currentLanguage ===
                                                                                                language.code
                                                                                                        ? 'text-white'
                                                                                                        : ''
                                                                                        }`}
                                                                                >
                                                                                        {language.flag}
                                                                                </CText>
                                                                                {/* Language Name */}
                                                                                <CText
                                                                                        className={`text-center text-sm ${
                                                                                                currentLanguage ===
                                                                                                language.code
                                                                                                        ? 'text-white'
                                                                                                        : ''
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
                                                <View className={`border-t ${separatorClass} p-4`}>
                                                        <TouchableOpacity
                                                                className="rounded-lg bg-white/10 p-3"
                                                                onPress={() => setLanguageModalVisible(false)}
                                                        >
                                                                <TranslatedText
                                                                        text="cancel"
                                                                        staticKey={true}
                                                                        className="text-center"
                                                                        weight="medium"
                                                                />
                                                        </TouchableOpacity>
                                                </View>
                                        </TouchableOpacity>
                                </TouchableOpacity>
                        </Modal>
                </SafeAreaView>
        );
};
