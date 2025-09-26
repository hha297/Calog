import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
        REFRESH_TOKEN: 'calog_refresh_token',
        USER_DATA: 'calog_user_data',
} as const;

class SecureStorageService {
        async storeRefreshToken(token: string): Promise<void> {
                await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
        }

        async getRefreshToken(): Promise<string | null> {
                return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        }

        async removeRefreshToken(): Promise<void> {
                await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        }

        async storeUserData(userData: any): Promise<void> {
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }

        async getUserData(): Promise<any | null> {
                const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
                return raw ? JSON.parse(raw) : null;
        }

        async removeUserData(): Promise<void> {
                await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }

        async clearAll(): Promise<void> {
                await Promise.all([this.removeRefreshToken(), this.removeUserData()]);
        }
}

export const secureStorage = new SecureStorageService();
