import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {
        ArrowLeft,
        User,
        Mail,
        Send,
        Star,
        Users,
        Share2,
        Globe,
        Sun,
        HelpCircle,
        Shield,
        Trash2,
        LogOut,
        Lock,
        FacebookIcon,
        InstagramIcon,
        LinkedinIcon,
        ChevronRight,
        MessageCircleQuestionIcon,
        LockIcon,
        ArrowRightIcon,
        ArrowRightCircleIcon,
        ExternalLinkIcon,
        UploadIcon,
        DownloadIcon,
} from 'lucide-react-native';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuthStore } from '../../store';
import { LinearGradient } from 'react-native-svg';

export const AccountScreen: React.FC = () => {
        const navigation = useNavigation();
        const { profile } = useUserProfile();
        const { user, logout } = useAuthStore();

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
                // TODO: Implement language selection
                console.log('Change language');
        };

        const handleDarkMode = () => {
                // TODO: Implement dark mode toggle
                console.log('Toggle dark mode');
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
                <SafeAreaView className="bg-background flex-1">
                        <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
                                {/* User Info Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl">
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
                                                <ArrowRightCircleIcon size={20} color="#FFFFFF" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handleLogout}
                                        >
                                                <LockIcon size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Change Password</CText>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-row items-center p-4" onPress={handleLogout}>
                                                <LogOut size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Sign Out</CText>
                                        </TouchableOpacity>
                                </View>

                                {/* Premium Feature Section */}
                                {/* <TouchableOpacity className="mb-6 rounded-xl bg-primary p-4">
                                        <View className="flex-row items-center">
                                                <Lock size={20} color="#FFFFFF" />
                                                <View className="ml-3 flex-1">
                                                        <CText weight="medium" className="text-white">
                                                                Use Premium Package
                                                        </CText>
                                                        <CText className="text-sm text-white/80">
                                                                No ads with full features
                                                        </CText>
                                                </View>
                                        </View>
                                </TouchableOpacity> */}

                                {/* Community & Feedback Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl">
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
                                                <View className="flex-row items-center space-x-2">
                                                        <View className="mr-2 rounded-full bg-primary p-2">
                                                                <FacebookIcon size={16} color="#FFFFFF" />
                                                        </View>
                                                        <View className="mr-2 rounded-full bg-primary p-2">
                                                                <InstagramIcon size={16} color="#FFFFFF" />
                                                        </View>
                                                        <View className="rounded-full bg-primary p-2">
                                                                <LinkedinIcon size={16} color="#FFFFFF" />
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                </View>

                                {/* App Settings Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl">
                                        <TouchableOpacity
                                                className="flex-row items-center border-b border-white/10 p-4"
                                                onPress={handleLanguage}
                                        >
                                                <Globe size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Language</CText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                className="flex-row items-center p-4"
                                                onPress={handleDarkMode}
                                        >
                                                <Sun size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">
                                                        Turn off Dark Mode
                                                </CText>
                                                <View className="h-6 w-12 items-center justify-center rounded-full bg-primary">
                                                        <View className="ml-4 h-4 w-4 rounded-full bg-white" />
                                                </View>
                                        </TouchableOpacity>
                                </View>

                                {/* Legal & Account Section */}
                                <View className="bg-surfacePrimary mb-6 rounded-xl">
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
                                                <Trash2 size={20} color="#4CAF50" />
                                                <CText className="text-text-light ml-3 flex-1">Delete Your Data</CText>
                                        </TouchableOpacity>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
