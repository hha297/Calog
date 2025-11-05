import { Platform } from 'react-native';

// API Configuration
const API_BASE_URL = __DEV__
        ? Platform.OS === 'android'
                ? 'http://10.0.0.2:4000' // Android emulator
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

        // Get base URL
        getBaseUrl(): string {
                return this.baseURL;
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

                        // Handle 401 Unauthorized before parsing response
                        if (response.status === 401) {
                                // Clear token and trigger logout
                                this.accessToken = null;
                                if (this.onUnauthorized) {
                                        this.onUnauthorized();
                                }
                                // Throw specific error for auth failures
                                throw new Error('unauthorized');
                        }

                        // Handle 204 No Content responses
                        if (response.status === 204) {
                                if (!response.ok) {
                                        throw new Error(`HTTP ${response.status}`);
                                }
                                return {} as T;
                        }

                        // Try to parse as JSON, but handle non-JSON responses gracefully
                        const contentType = response.headers.get('content-type');
                        let data: any;
                        try {
                                const text = await response.text();
                                if (!text || text.trim() === '') {
                                        // Empty response body
                                        if (!response.ok) {
                                                throw new Error(`HTTP ${response.status}`);
                                        }
                                        return {} as T;
                                }
                                data = JSON.parse(text);
                        } catch (parseError) {
                                // If content-type suggests JSON but parsing failed
                                if (contentType && contentType.includes('application/json')) {
                                        const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
                                        throw new Error(`Invalid JSON response: ${errorMsg}`);
                                }
                                // If response is ok but not JSON, return empty object
                                if (response.ok) {
                                        return {} as T;
                                }
                                // If response is not ok and not JSON, throw error
                                const errorMsg = parseError instanceof Error ? parseError.message : 'Invalid response';
                                throw new Error(`HTTP ${response.status}: ${errorMsg}`);
                        }

                        if (!response.ok) {
                                throw new Error(data.message || data.error || `HTTP ${response.status}`);
                        }

                        // Handle new response format from refactored backend
                        if (data && typeof data === 'object' && 'success' in data) {
                                // If success is false, throw an error even if HTTP status is 200
                                if (data.success === false) {
                                        throw new Error(data.message || data.error || 'Request failed');
                                }
                                // Return data field if present, otherwise return the whole object
                                return data.data !== undefined ? data.data : data;
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
