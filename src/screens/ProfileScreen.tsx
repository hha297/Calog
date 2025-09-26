import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';
import { Button } from '../components/ui/Button';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthStore } from '../store';

export const ProfileScreen: React.FC = () => {
        const { profile, isLoading, updateProfile } = useUserProfile();
        const { logout } = useAuthStore();

        const handleLogout = async () => {
                try {
                        await logout();
                } catch (error) {
                        console.error('Logout error:', error);
                }
        };

        if (isLoading) {
                return (
                        <SafeAreaView className="flex-1 bg-primary">
                                <View className="flex-1 items-center justify-center">
                                        <CText className="text-text-muted">Loading profile...</CText>
                                </View>
                        </SafeAreaView>
                );
        }

        return (
                <SafeAreaView className="flex-1 bg-primary">
                        <ScrollView className="flex-1 px-6">
                                {/* Header */}
                                <View className="py-6">
                                        <CText size="2xl" weight="bold" className="text-text-light mb-2">
                                                Profile
                                        </CText>
                                        <CText className="text-text-muted">
                                                Manage your personal information and goals
                                        </CText>
                                </View>

                                {/* Profile Information */}
                                {profile ? (
                                        <View className="mb-8">
                                                <CText size="lg" weight="medium" className="text-text-light mb-4">
                                                        Personal Information
                                                </CText>

                                                <View className="mb-4 rounded-xl bg-white/5 p-4">
                                                        <View className="mb-2 flex-row justify-between">
                                                                <CText className="text-text-muted">Gender</CText>
                                                                <CText className="text-text-light capitalize">
                                                                        {profile.gender}
                                                                </CText>
                                                        </View>
                                                        <View className="mb-2 flex-row justify-between">
                                                                <CText className="text-text-muted">Age</CText>
                                                                <CText className="text-text-light">
                                                                        {profile.age} years
                                                                </CText>
                                                        </View>
                                                        <View className="mb-2 flex-row justify-between">
                                                                <CText className="text-text-muted">Height</CText>
                                                                <CText className="text-text-light">
                                                                        {profile.height} cm
                                                                </CText>
                                                        </View>
                                                        <View className="mb-2 flex-row justify-between">
                                                                <CText className="text-text-muted">Weight</CText>
                                                                <CText className="text-text-light">
                                                                        {profile.weight} kg
                                                                </CText>
                                                        </View>
                                                        <View className="mb-2 flex-row justify-between">
                                                                <CText className="text-text-muted">
                                                                        Activity Level
                                                                </CText>
                                                                <CText className="text-text-light capitalize">
                                                                        {profile.activityLevel.replace('_', ' ')}
                                                                </CText>
                                                        </View>
                                                        <View className="mb-2 flex-row justify-between">
                                                                <CText className="text-text-muted">Goal</CText>
                                                                <CText className="text-text-light capitalize">
                                                                        {profile.goal} weight
                                                                </CText>
                                                        </View>
                                                        {profile.dailyCalorieGoal && (
                                                                <View className="flex-row justify-between">
                                                                        <CText className="text-text-muted">
                                                                                Daily Calorie Goal
                                                                        </CText>
                                                                        <CText className="font-semibold text-tertiary">
                                                                                {profile.dailyCalorieGoal} kcal
                                                                        </CText>
                                                                </View>
                                                        )}
                                                </View>
                                        </View>
                                ) : (
                                        <View className="mb-8">
                                                <CText className="text-text-muted text-center">
                                                        No profile information available
                                                </CText>
                                        </View>
                                )}

                                {/* Actions */}
                                <View className="mb-8">
                                        <Button
                                                title="Edit Profile"
                                                onPress={() => {
                                                        // TODO: Navigate to profile edit screen
                                                        console.log('Edit profile');
                                                }}
                                                variant="secondary"
                                                className="mb-4"
                                        />

                                        <Button title="Sign Out" onPress={handleLogout} variant="secondary" />
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
