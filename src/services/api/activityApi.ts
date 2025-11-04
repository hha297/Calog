import apiClient from './client';

export interface Activity {
        _id: string; // Mongoose subdocument _id
        name: string;
        caloriesPer30Min: number;
        description?: string;
        createdAt?: string;
        updatedAt?: string;
}

export interface CreateActivityDTO {
        name: string;
        caloriesPer30Min: number;
        description?: string;
}

export interface UpdateActivityDTO {
        name?: string;
        caloriesPer30Min?: number;
        description?: string;
}

export interface ApiResponse<T> {
        success: boolean;
        data?: T;
        message?: string;
}

// Create a new custom activity
export async function createActivity(activityData: CreateActivityDTO): Promise<ApiResponse<Activity>> {
        try {
                const response = await apiClient.post<ApiResponse<Activity>>('/api/activities', activityData);
                // API client may return data.data, so we need to handle both cases
                if (response && typeof response === 'object' && 'success' in response) {
                        return response as ApiResponse<Activity>;
                }
                return { success: true, data: response as any };
        } catch (error: any) {
                console.error('Error creating activity:', error);
                throw error;
        }
}

// Get all custom activities for the current user
export async function getUserActivities(): Promise<ApiResponse<Activity[]>> {
        try {
                const response = await apiClient.get<ApiResponse<Activity[]>>('/api/activities');
                // API client may return data.data, so we need to handle both cases
                if (response && typeof response === 'object' && 'success' in response) {
                        return response as ApiResponse<Activity[]>;
                }
                // If response is an array directly, wrap it
                if (Array.isArray(response)) {
                        return { success: true, data: response };
                }
                return { success: true, data: response as any };
        } catch (error: any) {
                console.error('Error fetching user activities:', error);
                // Return empty array on error instead of throwing
                return { success: false, data: [] };
        }
}

// Update an activity
export async function updateActivity(
        activityId: string,
        activityData: UpdateActivityDTO,
): Promise<ApiResponse<Activity>> {
        try {
                const response = await apiClient.put<ApiResponse<Activity>>(`/api/activities/${activityId}`, activityData);
                if (response && typeof response === 'object' && 'success' in response) {
                        return response as ApiResponse<Activity>;
                }
                return { success: true, data: response as any };
        } catch (error: any) {
                console.error('Error updating activity:', error);
                throw error;
        }
}

// Delete an activity
export async function deleteActivity(activityId: string): Promise<ApiResponse<void>> {
        try {
                const response = await apiClient.delete<ApiResponse<void>>(`/api/activities/${activityId}`);
                if (response && typeof response === 'object' && 'success' in response) {
                        return response as ApiResponse<void>;
                }
                return { success: true };
        } catch (error: any) {
                console.error('Error deleting activity:', error);
                throw error;
        }
}

