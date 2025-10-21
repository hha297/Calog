import { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { profileApi } from '../services/api/profileApi';
import { UserProfile } from '../types';
import { measurementLogStorage } from '../services/measurementLogStorage';

export const useUserProfile = () => {
        const [profile, setProfile] = useState<UserProfile | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const { user } = useAuthStore();

        useEffect(() => {
                loadProfile();
        }, [user]);

        const normalizeProfile = (p: any): UserProfile | null => {
                if (!p) return null;
                const merged: any = { ...p };
                const m = (p as any).measurements || {};
                const keys = ['neck', 'waist', 'hip', 'bicep', 'thigh'] as const;
                keys.forEach((k) => {
                        if (merged[k] === undefined && m[k] !== undefined && m[k] !== null) {
                                merged[k] = m[k];
                        }
                });
                return merged as UserProfile;
        };

        const loadProfile = async () => {
                try {
                        setIsLoading(true);

                        // Always fetch fresh data from API to ensure we have the latest profile
                        try {
                                const response = await profileApi.getProfile();

                                if (response.profile) {
                                        let merged = normalizeProfile(response.profile);
                                        // If no logs remain, clear measurement snapshot in client
                                        try {
                                                const logs = await measurementLogStorage.getLogs();
                                                if (!logs || logs.length === 0) {
                                                        if (merged) {
                                                                const cleared: any = { ...merged };
                                                                if (cleared.measurements) delete cleared.measurements;
                                                                ['neck', 'waist', 'hip', 'bicep', 'thigh'].forEach(
                                                                        (k) => {
                                                                                if (k in cleared)
                                                                                        delete cleared[
                                                                                                k as keyof typeof cleared
                                                                                        ];
                                                                        },
                                                                );
                                                                merged = cleared as UserProfile;
                                                        }
                                                }
                                        } catch {}

                                        setProfile(merged as UserProfile);
                                } else {
                                        // Fallback to user.profile if API returns no data
                                        const hasCompleteProfile =
                                                user?.profile &&
                                                user.profile.gender &&
                                                user.profile.age &&
                                                user.profile.height &&
                                                user.profile.weight;

                                        if (hasCompleteProfile) {
                                                setProfile(normalizeProfile(user.profile) as UserProfile);
                                        } else {
                                                setProfile(null);
                                        }
                                }
                        } catch (apiError) {
                                console.error('Failed to fetch profile from API:', apiError);

                                // Fallback to user.profile if API fails
                                const hasCompleteProfile =
                                        user?.profile &&
                                        user.profile.gender &&
                                        user.profile.age &&
                                        user.profile.height &&
                                        user.profile.weight;

                                if (hasCompleteProfile) {
                                        setProfile(normalizeProfile(user.profile) as UserProfile);
                                } else {
                                        setProfile(null);
                                }
                        }
                } catch (error) {
                        console.error('Error loading profile:', error);
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

                        // Update local state immediately for better UX
                        setProfile(updatedProfile);

                        // Also reload from API to ensure we have the latest data
                        await loadProfile();
                } catch (error) {
                        console.error('Error updating profile:', error);
                        throw error;
                }
        };

        const clearProfile = async () => {
                try {
                        setProfile(null);
                } catch (error) {
                        console.error('Error clearing profile:', error);
                }
        };

        return {
                profile,
                isLoading,
                updateProfile,
                clearProfile,
                loadProfile,
                setProfile,
        };
};
