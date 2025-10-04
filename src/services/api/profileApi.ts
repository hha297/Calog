import apiClient from './client';
import { UserProfile } from '../../types';

export interface ProfileUpdateRequest {
        profile: UserProfile;
}

export interface ProfileResponse {
        message: string;
        profile: UserProfile;
}

export interface BodyMeasurements {
        neck?: number; // cm
        waist?: number; // cm
        hip?: number; // cm
        bicep?: number; // cm
        thigh?: number; // cm
}

export const profileApi = {
        // Update user profile
        updateProfile: async (profile: UserProfile): Promise<ProfileResponse> => {
                const response = await apiClient.put<ProfileResponse>('/api/profile', { profile });
                return response;
        },

        // Get user profile from server
        getProfile: async (): Promise<ProfileResponse> => {
                const response = await apiClient.get<ProfileResponse>('/api/profile');
                return response;
        },

        // Calculate daily calorie goal based on profile
        calculateCalorieGoal: async (profile: UserProfile): Promise<{ dailyCalorieGoal: number }> => {
                const response = await apiClient.post<{ dailyCalorieGoal: number }>(
                        '/api/profile/calculate-calories',
                        profile,
                );
                return response;
        },

        // Update body measurements
        updateMeasurements: async (measurements: BodyMeasurements): Promise<ProfileResponse> => {
                const response = await apiClient.put<ProfileResponse>('/api/profile/measurements', {
                        measurements,
                });
                return response;
        },
};
