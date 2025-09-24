import * as Keychain from 'react-native-keychain';

// Storage keys
const STORAGE_KEYS = {
  REFRESH_TOKEN: 'calog_refresh_token',
  USER_DATA: 'calog_user_data',
} as const;

// Secure storage service
class SecureStorageService {
  // Store refresh token securely
  async storeRefreshToken(token: string): Promise<void> {
    try {
      await Keychain.setInternetCredentials(
        STORAGE_KEYS.REFRESH_TOKEN,
        'refresh_token',
        token
      );
    } catch (error) {
      console.error('Failed to store refresh token:', error);
      throw new Error('Failed to store refresh token');
    }
  }

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (credentials && credentials.password) {
        return credentials.password;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  // Remove refresh token
  async removeRefreshToken(): Promise<void> {
    try {
      await Keychain.resetInternetCredentials(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Failed to remove refresh token:', error);
      throw new Error('Failed to remove refresh token');
    }
  }

  // Store user data securely (optional - for offline access)
  async storeUserData(userData: any): Promise<void> {
    try {
      await Keychain.setInternetCredentials(
        STORAGE_KEYS.USER_DATA,
        'user_data',
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw new Error('Failed to store user data');
    }
  }

  // Get user data
  async getUserData(): Promise<any | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(STORAGE_KEYS.USER_DATA);
      
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  // Remove user data
  async removeUserData(): Promise<void> {
    try {
      await Keychain.resetInternetCredentials(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Failed to remove user data:', error);
      throw new Error('Failed to remove user data');
    }
  }

  // Clear all stored data
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.removeRefreshToken(),
        this.removeUserData(),
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw new Error('Failed to clear all data');
    }
  }
}

// Create and export singleton instance
export const secureStorage = new SecureStorageService();
export default secureStorage;
