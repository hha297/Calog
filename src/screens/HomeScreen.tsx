import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store';

interface HomeScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
        const { user, logout } = useAuthStore();

        const handleLogout = async () => {
                try {
                        await logout();
                } catch (error) {
                        console.error('Logout failed:', error);
                }
        };

        return (
                <SafeAreaView className="flex-1 bg-primary">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Welcome Header */}
                                        <View className="mb-8">
                                                <CText
                                                        size="3xl"
                                                        weight="bold"
                                                        className="text-text-light mb-2 text-center"
                                                >
                                                        Welcome to Calog!
                                                </CText>
                                                <CText className="text-text-muted text-center">
                                                        Track your nutrition and fitness journey
                                                </CText>
                                        </View>

                                        {/* User Info Card */}
                                        <View className="mb-6 rounded-lg bg-secondary p-6">
                                                <View className="items-center">
                                                        {/* Avatar */}
                                                        <View className="mb-3 h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-tertiary">
                                                                {user?.avatar ? (
                                                                        <Image
                                                                                source={{ uri: user.avatar }}
                                                                                className="h-16 w-16 rounded-full"
                                                                                resizeMode="cover"
                                                                        />
                                                                ) : (
                                                                        <CText className="text-xl text-white">
                                                                                {(user?.name || user?.fullName)
                                                                                        ?.charAt(0)
                                                                                        ?.toUpperCase()}
                                                                        </CText>
                                                                )}
                                                        </View>
                                                        <CText className="text-text-light mb-1 text-lg">
                                                                {user?.name || user?.fullName || 'User'}
                                                        </CText>
                                                        <CText className="text-text-muted">
                                                                {user?.email || 'user@example.com'}
                                                        </CText>
                                                        <CText className="mt-2 text-sm text-tertiary">
                                                                {user?.role?.toUpperCase() || 'FREE'} Plan
                                                        </CText>
                                                </View>
                                        </View>

                                        {/* Quick Actions */}
                                        <View className="mb-6">
                                                <CText className="text-text-light mb-4 text-lg">Quick Actions</CText>

                                                <View className="space-y-3">
                                                        <TouchableOpacity
                                                                className="rounded-lg bg-secondary p-4"
                                                                onPress={() => navigation.navigate('Scan')}
                                                        >
                                                                <CText className="text-text-light">📷 Scan Food</CText>
                                                                <CText className="text-text-muted mt-1 text-sm">
                                                                        Scan barcode to log food
                                                                </CText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                                className="rounded-lg bg-secondary p-4"
                                                                onPress={() => navigation.navigate('Log')}
                                                        >
                                                                <CText className="text-text-light">📝 Food Log</CText>
                                                                <CText className="text-text-muted mt-1 text-sm">
                                                                        View your food history
                                                                </CText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                                className="rounded-lg bg-secondary p-4"
                                                                onPress={() => navigation.navigate('Profile')}
                                                        >
                                                                <CText className="text-text-light">👤 Profile</CText>
                                                                <CText className="text-text-muted mt-1 text-sm">
                                                                        Manage your account
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
                                                <CText className="text-text-muted text-xs">
                                                        Calog v1.0.0 • Authentication System Ready
                                                </CText>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
