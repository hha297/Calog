import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { CText } from '../components/ui/CText';
import { useAuthStore } from '../store';
import { useLogoutMutation } from '../hooks/useAuth';

interface ProfileScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
        const { user, isAuthenticated } = useAuthStore();
        const logoutMutation = useLogoutMutation();

        const handleLogout = async () => {
                try {
                        await logoutMutation.mutateAsync();
                        // Navigation will be handled by the auth flow
                } catch (error) {
                        console.error('Logout failed:', error);
                        // Error is handled by the mutation and toast
                }
        };

        return (
                <SafeAreaView className="flex-1 bg-primary">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Header */}
                                        <View className="mb-8">
                                                <CText
                                                        size="3xl"
                                                        weight="bold"
                                                        className="text-text-light mb-2 text-center"
                                                >
                                                        Profile
                                                </CText>
                                                <CText className="text-text-muted text-center">
                                                        Manage your account
                                                </CText>
                                        </View>

                                        {/* Demo State Notice */}
                                        <View className="mb-8 rounded-lg border border-tertiary/20 bg-secondary p-4">
                                                <View className="mb-2 flex-row items-center">
                                                        <CText className="mr-2 text-lg">🎨</CText>
                                                        <CText className="text-tertiary">UI Demo Mode</CText>
                                                </View>
                                                <CText className="text-text-muted text-sm leading-5">
                                                        You're viewing a demo state. Secure session (JWT/Secure Storage)
                                                        will be added later.
                                                </CText>
                                        </View>

                                        {/* User Info Card */}
                                        <View className="mb-6 rounded-lg bg-secondary p-6">
                                                <View className="mb-4 items-center">
                                                        <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-tertiary">
                                                                <CText className="text-2xl text-white">
                                                                        {user?.fullName?.charAt(0)?.toUpperCase() ||
                                                                                'U'}
                                                                </CText>
                                                        </View>
                                                        <CText className="text-text-light mb-1 text-xl">
                                                                {user?.fullName || 'User'}
                                                        </CText>
                                                        <CText className="text-text-muted">
                                                                {user?.email || 'user@example.com'}
                                                        </CText>
                                                        <CText className="mt-2 text-sm text-tertiary">
                                                                {user?.role?.toUpperCase() || 'FREE'} Plan
                                                        </CText>
                                                </View>
                                        </View>

                                        {/* Account Settings */}
                                        <View className="mb-6">
                                                <CText className="text-text-light mb-4 text-lg">Account Settings</CText>

                                                <View className="space-y-3">
                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">Edit Profile</CText>
                                                                <CText className="text-text-muted mt-1 text-sm">
                                                                        Update your personal information
                                                                </CText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">
                                                                        Change Password
                                                                </CText>
                                                                <CText className="text-text-muted mt-1 text-sm">
                                                                        Update your password
                                                                </CText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">
                                                                        Privacy Settings
                                                                </CText>
                                                                <CText className="text-text-muted mt-1 text-sm">
                                                                        Manage your privacy preferences
                                                                </CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </View>

                                        {/* App Settings */}
                                        <View className="mb-8">
                                                <CText className="text-text-light mb-4 text-lg">App Settings</CText>

                                                <View className="space-y-3">
                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">Notifications</CText>
                                                                <CText className="text-text-muted mt-1 text-sm">
                                                                        Manage notification preferences
                                                                </CText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">Theme</CText>
                                                                <CText className="text-text-muted mt-1 text-sm">
                                                                        Dark mode (current)
                                                                </CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </View>

                                        {/* Logout Button */}
                                        <Button
                                                title="Sign Out"
                                                onPress={handleLogout}
                                                loading={logoutMutation.isPending}
                                                variant="ghost"
                                                className="mb-4"
                                        />

                                        {/* Footer */}
                                        <View className="items-center">
                                                <CText className="text-text-muted text-xs">
                                                        Version 1.0.0 • UI Demo
                                                </CText>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
