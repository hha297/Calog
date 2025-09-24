import { Platform } from 'react-native';

// API Configuration
const API_BASE_URL = __DEV__
        ? Platform.OS === 'android'
                ? 'http://10.0.2.2:4000' // Android emulator
                : 'http://localhost:4000' // iOS simulator
        : 'https://production-api.calog.com';

// API Client class
class ApiClient {
        private baseURL: string;
        private accessToken: string | null = null;
        private onUnauthorized: (() => void) | null = null;

        constructor(baseURL: string) {
                this.baseURL = baseURL;
        }

        // Set access token for authenticated requests
        setAccessToken(token: string | null) {
                this.accessToken = token;
        }

        // Set unauthorized callback
        setUnauthorizedCallback(callback: () => void) {
                this.onUnauthorized = callback;
        }

        // Get headers for requests
        private getHeaders(): Record<string, string> {
                const headers: Record<string, string> = {
                        'Content-Type': 'application/json',
                };

                if (this.accessToken) {
                        headers.Authorization = `Bearer ${this.accessToken}`;
                }

                return headers;
        }

        // Generic request method
        private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
                const url = `${this.baseURL}${endpoint}`;

                const config: RequestInit = {
                        ...options,
                        headers: {
                                ...this.getHeaders(),
                                ...options.headers,
                        },
                };

                try {
                        const response = await fetch(url, config);

                        // Handle non-JSON responses
                        const contentType = response.headers.get('content-type');
                        if (!contentType || !contentType.includes('application/json')) {
                                throw new Error('Invalid response format');
                        }

                        const data = await response.json();

                        if (!response.ok) {
                                // Handle 401 Unauthorized - token expired or invalid
                                if (response.status === 401) {
                                        // Clear token and trigger logout
                                        this.accessToken = null;
                                        if (this.onUnauthorized) {
                                                this.onUnauthorized();
                                        }
                                }
                                throw new Error(data.message || `HTTP ${response.status}`);
                        }

                        // Handle new response format from refactored backend
                        if (data.success !== undefined) {
                                return data.data || data;
                        }

                        return data;
                } catch (error) {
                        if (error instanceof Error) {
                                throw error;
                        }
                        throw new Error('Network error occurred');
                }
        }

        // GET request
        async get<T>(endpoint: string): Promise<T> {
                return this.request<T>(endpoint, { method: 'GET' });
        }

        // POST request
        async post<T>(endpoint: string, data?: any): Promise<T> {
                return this.request<T>(endpoint, {
                        method: 'POST',
                        body: data ? JSON.stringify(data) : undefined,
                });
        }

        // PUT request
        async put<T>(endpoint: string, data?: any): Promise<T> {
                return this.request<T>(endpoint, {
                        method: 'PUT',
                        body: data ? JSON.stringify(data) : undefined,
                });
        }

        // DELETE request
        async delete<T>(endpoint: string): Promise<T> {
                return this.request<T>(endpoint, { method: 'DELETE' });
        }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export the client for use in auth store
export default apiClient;
