import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store';
import { useUserProfile } from '../hooks/useUserProfile';
import { Target, TrendingUp, TrendingDown, Scale } from 'lucide-react-native';

interface HomeScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
        const { user, logout } = useAuthStore();
        const { profile, isLoading } = useUserProfile();

        const handleLogout = async () => {
                try {
                        await logout();
                } catch (error) {}
        };

        const getGoalIcon = () => {
                if (!profile?.goal) return Scale;
                switch (profile.goal) {
                        case 'lose':
                                return TrendingDown;
                        case 'gain':
                                return TrendingUp;
                        default:
                                return Scale;
                }
        };

        const getGoalText = () => {
                if (!profile?.goal) return 'Maintain Weight';
                switch (profile.goal) {
                        case 'lose':
                                return 'Lose Weight';
                        case 'gain':
                                return 'Gain Weight';
                        default:
                                return 'Maintain Weight';
                }
        };

        return (
                <SafeAreaView className="bg-background flex-1">
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
                                        <View className="mb-6 rounded-lg bg-primary p-6">
                                                <View className="items-center">
                                                        {/* Avatar */}
                                                        <View className="mb-3 h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary">
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
                                                        <CText className="mt-2 text-sm text-primary">
                                                                {user?.role?.toUpperCase() || 'FREE'} Plan
                                                        </CText>
                                                </View>
                                        </View>

                                        {/* Daily Calorie Goal Card */}
                                        {profile && (
                                                <View className="mb-6 rounded-lg bg-primary p-6">
                                                        <View className="items-center">
                                                                <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                                                        <Target size={24} color="#10B981" />
                                                                </View>
                                                                <CText className="text-text-light mb-2 text-xl">
                                                                        Daily Calorie Goal
                                                                </CText>
                                                                <CText className="mb-2 text-3xl font-bold text-primary">
                                                                        {profile.dailyCalorieGoal || 0}
                                                                </CText>
                                                                <CText className="text-text-muted text-sm">
                                                                        calories per day
                                                                </CText>

                                                                {/* Goal Details */}
                                                                <View className="mt-4 w-full">
                                                                        <View className="flex-row items-center justify-center">
                                                                                {React.createElement(getGoalIcon(), {
                                                                                        size: 16,
                                                                                        color: '#10B981',
                                                                                })}
                                                                                <CText className="text-text-light ml-2 text-sm">
                                                                                        {getGoalText()}
                                                                                </CText>
                                                                        </View>

                                                                        {/* Show target weight and rate if available */}
                                                                        {profile.targetWeight &&
                                                                                profile.weightChangeRate && (
                                                                                        <View className="mt-2">
                                                                                                <CText className="text-text-muted text-center text-xs">
                                                                                                        Target:{' '}
                                                                                                        {
                                                                                                                profile.targetWeight
                                                                                                        }
                                                                                                        kg
                                                                                                </CText>
                                                                                                <CText className="text-text-muted text-center text-xs">
                                                                                                        Rate:{' '}
                                                                                                        {
                                                                                                                profile.weightChangeRate
                                                                                                        }
                                                                                                        kg/week
                                                                                                </CText>
                                                                                        </View>
                                                                                )}
                                                                </View>
                                                        </View>
                                                </View>
                                        )}

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
