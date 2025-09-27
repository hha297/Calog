import { useState, useEffect } from 'react';
import { onboardingStorage } from '../services/onboardingStorage';
import { UserProfile } from '../types';

export const useUserProfile = () => {
        const [profile, setProfile] = useState<UserProfile | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                loadProfile();
        }, []);

        const loadProfile = async () => {
                try {
                        setIsLoading(true);
                        const profileData = await onboardingStorage.getUserProfile();
                        setProfile(profileData);
                } catch (error) {
                } finally {
                        setIsLoading(false);
                }
        };

        const updateProfile = async (newProfile: Partial<UserProfile>) => {
                try {
                        if (!profile) return;
                        const updatedProfile = { ...profile, ...newProfile } as UserProfile;
                        await onboardingStorage.saveUserProfile(updatedProfile);
                        setProfile(updatedProfile);
                } catch (error) {}
        };

        const clearProfile = async () => {
                try {
                        await onboardingStorage.resetOnboarding();
                        setProfile(null);
                } catch (error) {}
        };

        return {
                profile,
                isLoading,
                updateProfile,
                clearProfile,
                loadProfile,
        };
};
