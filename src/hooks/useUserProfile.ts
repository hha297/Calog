import { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { profileApi } from '../services/api/profileApi';
import { UserProfile } from '../types';

export const useUserProfile = () => {
        const [profile, setProfile] = useState<UserProfile | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const { user } = useAuthStore();

        useEffect(() => {
                loadProfile();
        }, [user]);

        const loadProfile = async () => {
                try {
                        setIsLoading(true);
                        console.log('useUserProfile - Loading profile for user:', user);

                        // First try to get profile from user object (from auth store)
                        if (user?.profile) {
                                console.log('useUserProfile - Found profile in user object:', user.profile);
                                setProfile(user.profile);
                                setIsLoading(false);
                                return;
                        }

                        // Debug: Check user object structure
                        console.log('useUserProfile - User object structure:', {
                                name: user?.name,
                                fullName: user?.fullName,
                                email: user?.email,
                                avatar: user?.avatar,

                                profilePicture: (user as any)?.profilePicture,
                                picture: (user as any)?.picture,
                                photoURL: (user as any)?.photoURL,
                        });

                        // If no profile in user object, try to fetch from API
                        try {
                                const response = await profileApi.getProfile();
                                setProfile(response.profile);
                        } catch (apiError) {
                                console.log('Failed to fetch profile from API:', apiError);
                                // If API fails, keep profile as null
                                setProfile(null);
                        }
                } catch (error) {
                        console.log('Error loading profile:', error);
                        setProfile(null);
                } finally {
                        setIsLoading(false);
                }
        };

        const updateProfile = async (newProfile: Partial<UserProfile>) => {
                try {
                        // Create updated profile by merging with current profile or using newProfile as base
                        const updatedProfile = profile ? { ...profile, ...newProfile } : (newProfile as UserProfile);

                        // Update via API
                        await profileApi.updateProfile(updatedProfile);

                        // Update local state
                        setProfile(updatedProfile);

                        console.log('Profile updated successfully:', updatedProfile);
                } catch (error) {
                        console.log('Error updating profile:', error);
                        throw error;
                }
        };

        const clearProfile = async () => {
                try {
                        setProfile(null);
                        console.log('Profile cleared');
                } catch (error) {
                        console.log('Error clearing profile:', error);
                }
        };

        return {
                profile,
                isLoading,
                updateProfile,
                clearProfile,
                loadProfile,
        };
};
