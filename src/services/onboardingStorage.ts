import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store';

const ONBOARDING_KEY = '@calog_onboarding_completed';
const USER_PROFILE_KEY = '@calog_user_profile';

export const onboardingStorage = {
        // Check if user has completed onboarding
        async hasCompletedOnboarding(): Promise<boolean> {
                try {
                        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
                        return value === 'true';
                } catch (error) {
                        return false;
                }
        },

        // Mark onboarding as completed
        async setOnboardingCompleted(): Promise<void> {
                try {
                        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
                } catch (error) {}
        },

        // Reset onboarding status (for testing or logout)
        async resetOnboarding(): Promise<void> {
                try {
                        await AsyncStorage.removeItem(ONBOARDING_KEY);
                        await AsyncStorage.removeItem(USER_PROFILE_KEY);
                } catch (error) {}
        },

        // Save user profile data
        async saveUserProfile(profile: any): Promise<void> {
                try {
                        await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
                } catch (error) {}
        },

        // Get user profile data
        async getUserProfile(): Promise<any | null> {
                try {
                        const value = await AsyncStorage.getItem(USER_PROFILE_KEY);
                        return value ? JSON.parse(value) : null;
                } catch (error) {
                        return null;
                }
        },
};
