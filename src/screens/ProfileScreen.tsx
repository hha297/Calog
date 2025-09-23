import React from 'react';
import { View, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { CText } from '../components/ui/CText';

interface ProfileScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
        const handleLogout = () => {
                // TODO: Clear JWT token from SecureStore/Keychain
                // TODO: Clear user session data
                // TODO: Reset navigation stack

                // Mock logout - navigate back to Login
                navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                });
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
                                                        className="mb-2 text-center text-text-light"
                                                >
                                                        Profile
                                                </CText>
                                                <CText className="text-center text-text-muted">
                                                        Manage your account
                                                </CText>
                                        </View>

                                        {/* Demo State Notice */}
                                        <View className="mb-8 rounded-lg border border-tertiary/20 bg-secondary p-4">
                                                <View className="mb-2 flex-row items-center">
                                                        <CText className="mr-2 text-lg">🎨</CText>
                                                        <CText className="text-tertiary">UI Demo Mode</CText>
                                                </View>
                                                <CText className="text-sm leading-5 text-text-muted">
                                                        You're viewing a demo state. Secure session (JWT/Secure Storage)
                                                        will be added later.
                                                </CText>
                                        </View>

                                        {/* User Info Card */}
                                        <View className="mb-6 rounded-lg bg-secondary p-6">
                                                <View className="mb-4 items-center">
                                                        <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-tertiary">
                                                                <CText className="text-2xl text-white">JD</CText>
                                                        </View>
                                                        <CText className="mb-1 text-xl text-text-light">John Doe</CText>
                                                        <CText className="text-text-muted">john.doe@example.com</CText>
                                                </View>
                                        </View>

                                        {/* Account Settings */}
                                        <View className="mb-6">
                                                <CText className="mb-4 text-lg text-text-light">Account Settings</CText>

                                                <View className="space-y-3">
                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">Edit Profile</CText>
                                                                <CText className="mt-1 text-sm text-text-muted">
                                                                        Update your personal information
                                                                </CText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">
                                                                        Change Password
                                                                </CText>
                                                                <CText className="mt-1 text-sm text-text-muted">
                                                                        Update your password
                                                                </CText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">
                                                                        Privacy Settings
                                                                </CText>
                                                                <CText className="mt-1 text-sm text-text-muted">
                                                                        Manage your privacy preferences
                                                                </CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </View>

                                        {/* App Settings */}
                                        <View className="mb-8">
                                                <CText className="mb-4 text-lg text-text-light">App Settings</CText>

                                                <View className="space-y-3">
                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">Notifications</CText>
                                                                <CText className="mt-1 text-sm text-text-muted">
                                                                        Manage notification preferences
                                                                </CText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity className="rounded-lg bg-secondary p-4">
                                                                <CText className="text-text-light">Theme</CText>
                                                                <CText className="mt-1 text-sm text-text-muted">
                                                                        Dark mode (current)
                                                                </CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </View>

                                        {/* Logout Button */}
                                        <Button
                                                title="Sign Out"
                                                onPress={handleLogout}
                                                variant="ghost"
                                                className="mb-4"
                                        />

                                        {/* Footer */}
                                        <View className="items-center">
                                                <CText className="text-xs text-text-muted">
                                                        Version 1.0.0 • UI Demo
                                                </CText>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
