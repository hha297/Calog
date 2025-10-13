import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
        REFRESH_TOKEN: 'calog_refresh_token',
        USER_DATA: 'calog_user_data',
} as const;

class SecureStorageService {
        async storeRefreshToken(token: string): Promise<void> {
                try {
                        await Keychain.setGenericPassword(STORAGE_KEYS.REFRESH_TOKEN, token, {
                                service: 'calog_refresh_token',
                        });
                } catch (error) {
                        throw new Error('Failed to store refresh token');
                }
        }

        async getRefreshToken(): Promise<string | null> {
                try {
                        const credentials = await Keychain.getGenericPassword({
                                service: 'calog_refresh_token',
                        });
                        return credentials ? credentials.password : null;
                } catch (error) {
                        return null;
                }
        }

        async removeRefreshToken(): Promise<void> {
                try {
                        await Keychain.resetGenericPassword({
                                service: 'calog_refresh_token',
                        });
                } catch (error) {
                        throw new Error('Failed to remove refresh token');
                }
        }

        async storeUserData(userData: any): Promise<void> {
                try {
                        await Keychain.setGenericPassword(STORAGE_KEYS.USER_DATA, JSON.stringify(userData), {
                                service: 'calog_user_data',
                                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                        });
                } catch (error) {
                        try {
                                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
                        } catch (asyncError) {
                                throw new Error('Failed to store user data');
                        }
                }
        }

        async getUserData(): Promise<any | null> {
                try {
                        const credentials = await Keychain.getGenericPassword({
                                service: 'calog_user_data',
                        });
                        if (credentials) {
                                return JSON.parse(credentials.password);
                        }
                        return null;
                } catch (error) {
                        try {
                                const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
                                return data ? JSON.parse(data) : null;
                        } catch (asyncError) {
                                return null;
                        }
                }
        }

        async removeUserData(): Promise<void> {
                try {
                        await Keychain.resetGenericPassword({
                                service: 'calog_user_data',
                        });
                } catch (error) {
                        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
                }
        }

        async clearAll(): Promise<void> {
                try {
                        await Promise.all([
                                this.removeRefreshToken(),
                                this.removeUserData(),
                                AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
                        ]);
                } catch (error) {
                        throw new Error('Failed to clear all data');
                }
        }
}

export const secureStorage = new SecureStorageService();
