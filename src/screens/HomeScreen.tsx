import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/ui/CText';
import { TranslatedText } from '../components/ui/TranslatedText';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store';
import { useUserProfile } from '../hooks/useUserProfile';
import { Target, TrendingUp, TrendingDown, Scale } from 'lucide-react-native';
import { useLanguage } from '../contexts';
import { getStaticTranslation } from '../utils/translations';

interface HomeScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
        const { user, logout } = useAuthStore();
        const { profile, isLoading } = useUserProfile();
        const { currentLanguage } = useLanguage();

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
                if (!profile?.goal) return getStaticTranslation('maintainWeight', currentLanguage);
                switch (profile.goal) {
                        case 'lose':
                                return getStaticTranslation('loseWeight', currentLanguage);
                        case 'gain':
                                return getStaticTranslation('gainWeight', currentLanguage);
                        default:
                                return getStaticTranslation('maintainWeight', currentLanguage);
                }
        };

        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Welcome Header */}
                                        <View className="mb-8">
                                                <TranslatedText
                                                        text="welcomeToCalog"
                                                        staticKey={true}
                                                        size="2xl"
                                                        weight="bold"
                                                        className="mb-2 text-center text-textPrimary dark:text-textPrimary-dark"
                                                />
                                                <TranslatedText
                                                        text="trackYourNutrition"
                                                        staticKey={true}
                                                        className="text-center text-textSecondary dark:text-textSecondary-dark"
                                                />
                                        </View>

                                        {/* User Info Card */}
                                        <View className="mb-6 rounded-lg bg-surfacePrimary p-6 dark:bg-surfacePrimary-dark">
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
                                                                        <CText className="text-xl text-primary">
                                                                                {(user?.name || user?.fullName)
                                                                                        ?.charAt(0)
                                                                                        ?.toUpperCase()}
                                                                        </CText>
                                                                )}
                                                        </View>
                                                        <CText className="mb-1 text-lg text-textPrimary dark:text-textPrimary-dark">
                                                                {user?.name || user?.fullName || 'User'}
                                                        </CText>
                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                {user?.email || 'user@example.com'}
                                                        </CText>
                                                        <CText className="mt-2 text-sm text-primary">
                                                                {user?.role?.toUpperCase() || 'FREE'}{' '}
                                                                <TranslatedText
                                                                        text="plan"
                                                                        staticKey={true}
                                                                        className="text-sm text-primary"
                                                                />
                                                        </CText>
                                                </View>
                                        </View>

                                        {/* Daily Calorie Goal Card */}
                                        {profile && (
                                                <View className="mb-6 rounded-lg bg-surfacePrimary p-6 dark:bg-surfacePrimary-dark">
                                                        <View className="items-center">
                                                                <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                                                        <Target size={24} color="#4CAF50" />
                                                                </View>
                                                                <TranslatedText
                                                                        text="dailyCalorieGoal"
                                                                        staticKey={true}
                                                                        className="mb-2 text-xl text-textPrimary dark:text-textPrimary-dark"
                                                                />
                                                                <CText
                                                                        className="mb-2 text-3xl text-primary"
                                                                        weight="bold"
                                                                >
                                                                        {profile.dailyCalorieGoal || 0}
                                                                </CText>
                                                                <TranslatedText
                                                                        text="caloriesPerDay"
                                                                        staticKey={true}
                                                                        className="text-sm text-textSecondary dark:text-textSecondary-dark"
                                                                />

                                                                {/* Goal Details */}
                                                                <View className="mt-4 w-full">
                                                                        <View className="flex-row items-center justify-center">
                                                                                {React.createElement(getGoalIcon(), {
                                                                                        size: 16,
                                                                                        color: '#4CAF50',
                                                                                })}
                                                                                <CText className="ml-2 text-sm text-textSecondary dark:text-textSecondary-dark">
                                                                                        {getGoalText()}
                                                                                </CText>
                                                                        </View>

                                                                        {/* Show target weight and rate if available */}
                                                                        {profile.targetWeight &&
                                                                                profile.weightChangeRate && (
                                                                                        <View className="mt-2">
                                                                                                <CText className="text-center text-xs text-textTertiary dark:text-textTertiary-dark">
                                                                                                        <TranslatedText
                                                                                                                text="target"
                                                                                                                staticKey={
                                                                                                                        true
                                                                                                                }
                                                                                                                className="text-xs"
                                                                                                        />
                                                                                                        :{' '}
                                                                                                        {
                                                                                                                profile.targetWeight
                                                                                                        }{' '}
                                                                                                        kg
                                                                                                </CText>
                                                                                                <CText className="text-center text-xs text-textTertiary dark:text-textTertiary-dark">
                                                                                                        <TranslatedText
                                                                                                                text="rate"
                                                                                                                staticKey={
                                                                                                                        true
                                                                                                                }
                                                                                                                className="text-xs"
                                                                                                        />
                                                                                                        :{' '}
                                                                                                        {
                                                                                                                profile.weightChangeRate
                                                                                                        }{' '}
                                                                                                        kcal/day
                                                                                                </CText>
                                                                                        </View>
                                                                                )}
                                                                </View>
                                                        </View>
                                                </View>
                                        )}

                                        {/* Logout Button */}
                                        <Button
                                                title="signOut"
                                                onPress={handleLogout}
                                                variant="ghost"
                                                className="mb-4"
                                                translate
                                        />

                                        {/* Footer */}
                                        <View className="items-center">
                                                <CText className="text-xs text-textTertiary dark:text-textTertiary-dark">
                                                        Calog v1.0.0 • Authentication System Ready
                                                </CText>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
