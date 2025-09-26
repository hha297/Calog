// User role types
export type UserRole = 'free' | 'premium' | 'admin';

// User interface
export interface User {
        _id: string;
        id?: string; // For Google Sign-In compatibility
        googleId?: string; // Google OAuth ID
        fullName?: string; // Optional for Google users
        name?: string; // Google display name
        email: string;
        avatar?: string; // Google profile picture
        role: UserRole;
        profile?: UserProfile; // User profile data
        createdAt: string;
        updatedAt: string;
}

// User profile interface
export interface UserProfile {
        gender: 'male' | 'female' | 'other';
        age: number;
        height: number; // in cm
        weight: number; // in kg
        activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
        goal: 'maintain' | 'lose' | 'gain';
        dailyCalorieGoal?: number; // calculated based on profile
}

// Authentication interfaces
export interface AuthTokens {
        accessToken: string;
        refreshToken?: string;
        idToken?: string; // For Google Sign-In
        expiresIn?: number;
        tokenType?: string;
}

export interface AuthResponse {
        message: string;
        user: User;
        accessToken: string;
        refreshToken?: string;
}

export interface RefreshTokenResponse {
        message: string;
        accessToken: string;
        refreshToken: string;
}

// Form data interfaces
export interface SignupFormData {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
}

export interface LoginFormData {
        email: string;
        password: string;
        rememberMe?: boolean;
}

// API request interfaces
export interface SignupRequest {
        fullName: string;
        email: string;
        password: string;
}

export interface LoginRequest {
        email: string;
        password: string;
        rememberMe?: boolean;
}

export interface RefreshTokenRequest {
        refreshToken: string;
}

export interface LogoutRequest {
        refreshToken?: string;
}

// Auth store state
export interface AuthState {
        // State
        user: User | null;
        accessToken: string | null;
        refreshToken: string | null;
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;

        // Actions
        login: (tokens: AuthTokens, user: User, rememberMe?: boolean) => Promise<void>;
        logout: () => Promise<void>;
        refresh: () => Promise<boolean>;
        setUser: (user: User) => void;
        setTokens: (tokens: AuthTokens) => void;
        clearError: () => void;
        setLoading: (loading: boolean) => void;
        setupUnauthorizedCallback: () => void;
}

// API error interface
export interface ApiError {
        message: string;
        errors?: Array<{
                field: string;
                message: string;
        }>;
}

// Navigation types
export type AuthStackParamList = {
        Login: undefined;
        Signup: undefined;
        ForgotPassword: undefined;
        TermsOfService: undefined;
        PrivacyPolicy: undefined;
};

export type MainStackParamList = {
        Home: undefined;
        Profile: undefined;
        Log: undefined;
        Scan: undefined;
};

export type RootStackParamList = {
        Auth: undefined;
        Onboarding: undefined;
        Main: undefined;
};
