import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AuthTokens, User } from '../types';
import { GOOGLE_CONFIG } from '../config/google';

// Google OAuth service using @react-native-google-signin/google-signin
export class GoogleSigninService {
        /**
         * Initialize Google Sign-In
         */
        static async initialize() {
                try {
                        await GoogleSignin.configure({
                                webClientId: GOOGLE_CONFIG.webClientId,
                                offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
                                hostedDomain: '', // specifies a hosted domain restriction
                                forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
                                accountName: '', // [Android] specifies an account name on the device that should be used
                        });
                } catch (error) {
                        console.error('Google Sign-In initialization error:', error);
                        throw error;
                }
        }

        /**
         * Check if Google Play Services are available
         */
        static async isPlayServicesAvailable(): Promise<boolean> {
                try {
                        await GoogleSignin.hasPlayServices();
                        return true;
                } catch (error) {
                        console.error('Google Play Services not available:', error);
                        return false;
                }
        }

        /**
         * Sign in with Google
         */
        static async signIn(): Promise<{
                user: User;
                tokens: AuthTokens;
        }> {
                try {
                        // Check if Google Play Services are available
                        const isPlayServicesAvailable = await this.isPlayServicesAvailable();
                        if (!isPlayServicesAvailable) {
                                throw new Error('Google Play Services not available');
                        }

                        // Sign in
                        const userInfo = await GoogleSignin.signIn();

                        if (!userInfo.data) {
                                throw new Error('No user information received');
                        }

                        // Get access token
                        const tokens = await GoogleSignin.getTokens();

                        // Format user data
                        const user: User = {
                                _id: userInfo.data.user.id,
                                id: userInfo.data.user.id,
                                email: userInfo.data.user.email,
                                name: userInfo.data.user.name || '',
                                avatar: userInfo.data.user.photo || '',
                                role: 'free',
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                        };

                        // Format tokens
                        const authTokens: AuthTokens = {
                                accessToken: tokens.accessToken,
                                refreshToken: '', // Google Sign-In doesn't provide refresh token directly
                                idToken: userInfo.data.idToken || '',
                                expiresIn: 3600, // Default 1 hour
                                tokenType: 'Bearer',
                        };

                        return {
                                user,
                                tokens: authTokens,
                        };
                } catch (error: any) {
                        console.error('Google Sign-In error:', error);

                        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                                throw new Error('Sign-in was cancelled');
                        } else if (error.code === statusCodes.IN_PROGRESS) {
                                throw new Error('Sign-in is already in progress');
                        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                                throw new Error('Google Play Services not available');
                        } else {
                                throw new Error(`Sign-in failed: ${error.message}`);
                        }
                }
        }

        /**
         * Sign out from Google
         */
        static async signOut(): Promise<void> {
                try {
                        await GoogleSignin.signOut();
                } catch (error) {
                        console.error('Google Sign-Out error:', error);
                        throw error;
                }
        }

        /**
         * Revoke access and sign out
         */
        static async revokeAccess(): Promise<void> {
                try {
                        await GoogleSignin.revokeAccess();
                } catch (error) {
                        console.error('Google Revoke Access error:', error);
                        throw error;
                }
        }

        /**
         * Get current user
         */
        static async getCurrentUser() {
                try {
                        const userInfo = await GoogleSignin.getCurrentUser();
                        return userInfo;
                } catch (error) {
                        console.error('Get current user error:', error);
                        return null;
                }
        }

        /**
         * Check if user is signed in
         */
        static async isSignedIn(): Promise<boolean> {
                try {
                        const userInfo = await GoogleSignin.getCurrentUser();
                        return !!userInfo;
                } catch (error) {
                        console.error('Check sign-in status error:', error);
                        return false;
                }
        }

        /**
         * Get tokens
         */
        static async getTokens() {
                try {
                        return await GoogleSignin.getTokens();
                } catch (error) {
                        console.error('Get tokens error:', error);
                        throw error;
                }
        }
}
