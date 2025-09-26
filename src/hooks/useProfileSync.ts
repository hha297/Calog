import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { onboardingStorage } from '../services/onboardingStorage';
import { profileApi } from '../services/api/profileApi';
import Toast from 'react-native-toast-message';
import { UserProfile } from '../types';

export const useProfileSync = () => {
        const { isAuthenticated, accessToken } = useAuthStore();

        useEffect(() => {
                const syncProfile = async () => {
                        if (!isAuthenticated || !accessToken) {
                                return;
                        }

                        try {
                                // Check if there's a local profile to sync (fallback for failed syncs)
                                const localProfile = await onboardingStorage.getUserProfile();

                                if (localProfile) {
                                        // Sync profile to server
                                        await profileApi.updateProfile(localProfile as UserProfile);

                                        // Show success message
                                        Toast.show({
                                                type: 'success',
                                                text1: 'Profile Synced!',
                                                text2: 'Your profile has been saved to the cloud',
                                                position: 'top',
                                        });

                                        // Clear local profile after successful sync
                                        await onboardingStorage.resetOnboarding();
                                }
                        } catch (error) {
                                console.error('Profile sync error:', error);

                                // Show error but don't block the app
                                Toast.show({
                                        type: 'error',
                                        text1: 'Sync Failed',
                                        text2: 'Profile will sync when connection improves',
                                        position: 'top',
                                });
                        }
                };

                syncProfile();
        }, [isAuthenticated, accessToken]);
};
