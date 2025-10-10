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

        // Debug endpoint to test authentication
        debugProfile: async (): Promise<any> => {
                const response = await apiClient.get<any>('/api/profile/debug');
                return response;
        },

        // Delete user account and all related data
        deleteAccount: async (): Promise<{ message: string; deletedLogs: number }> => {
                const response = await apiClient.delete<{ message: string; deletedLogs: number }>('/auth/account');
                return response;
        },

        // Upload avatar
        uploadAvatar: async (base64Image: string): Promise<{ message: string; avatar: string }> => {
                const response = await apiClient.post<{ message: string; avatar: string }>(
                        '/api/profile/upload-avatar',
                        {
                                image: base64Image,
                        },
                );
                return response;
        },

        // Update user info (name, email)
        updateUserInfo: async (name: string): Promise<{ message: string; user: any }> => {
                const response = await apiClient.put<{ message: string; user: any }>('/api/profile/user-info', {
                        name,
                });
                return response;
        },
};
