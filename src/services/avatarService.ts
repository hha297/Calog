import { launchCamera, launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import apiClient from './api/client';

export interface AvatarUploadResult {
        success: boolean;
        avatarUrl?: string;
        error?: string;
}

/**
 * Request camera permission on Android
 */
const requestCameraPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
                try {
                        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                                title: 'Camera Permission',
                                message: 'Calog needs access to your camera to take photos.',
                                buttonNeutral: 'Ask Me Later',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'OK',
                        });
                        return granted === PermissionsAndroid.RESULTS.GRANTED;
                } catch (err) {
                        console.warn(err);
                        return false;
                }
        }
        return true;
};

/**
 * Convert image to base64
 */
const imageToBase64 = async (uri: string): Promise<string> => {
        try {
                // For React Native, we need to use fetch or a library to convert to base64
                const response = await fetch(uri);
                const blob = await response.blob();

                return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                                const base64data = reader.result as string;
                                resolve(base64data);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                });
        } catch (error) {
                console.error('Error converting image to base64:', error);
                throw error;
        }
};

/**
 * Handle image picker response
 */
const handleImageResponse = (response: ImagePickerResponse): Asset | null => {
        if (response.didCancel) {
                console.log('User cancelled image picker');
                return null;
        }

        if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', response.errorMessage || 'Failed to pick image');
                return null;
        }

        if (response.assets && response.assets.length > 0) {
                return response.assets[0];
        }

        return null;
};

/**
 * Pick image from gallery
 */
export const pickImageFromGallery = async (): Promise<Asset | null> => {
        return new Promise((resolve) => {
                launchImageLibrary(
                        {
                                mediaType: 'photo',
                                quality: 0.8,
                                maxWidth: 1024,
                                maxHeight: 1024,
                                includeBase64: false,
                        },
                        (response) => {
                                const asset = handleImageResponse(response);
                                resolve(asset);
                        },
                );
        });
};

/**
 * Take photo with camera
 */
export const takePhotoWithCamera = async (): Promise<Asset | null> => {
        // Request camera permission first
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
                Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
                return null;
        }

        return new Promise((resolve) => {
                launchCamera(
                        {
                                mediaType: 'photo',
                                quality: 0.8,
                                maxWidth: 1024,
                                maxHeight: 1024,
                                includeBase64: false,
                                saveToPhotos: false,
                        },
                        (response) => {
                                const asset = handleImageResponse(response);
                                resolve(asset);
                        },
                );
        });
};

/**
 * Show image source selection
 */
export const selectImageSource = (): Promise<'camera' | 'gallery' | null> => {
        return new Promise((resolve) => {
                Alert.alert(
                        'Select Image Source',
                        'Choose where to get your profile picture from',
                        [
                                {
                                        text: 'Take Photo',
                                        onPress: () => resolve('camera'),
                                },
                                {
                                        text: 'Choose from Gallery',
                                        onPress: () => resolve('gallery'),
                                },
                                {
                                        text: 'Cancel',
                                        onPress: () => resolve(null),
                                        style: 'cancel',
                                },
                        ],
                        { cancelable: true, onDismiss: () => resolve(null) },
                );
        });
};

/**
 * Upload avatar to server
 */
export const uploadAvatar = async (imageUri: string): Promise<AvatarUploadResult> => {
        try {
                // Convert image to base64
                const base64Image = await imageToBase64(imageUri);

                // Upload to server
                const response = await apiClient.post<{ message: string; avatar: string }>(
                        '/api/profile/upload-avatar',
                        {
                                image: base64Image,
                        },
                );

                return {
                        success: true,
                        avatarUrl: response.avatar,
                };
        } catch (error: any) {
                console.error('Error uploading avatar:', error);
                return {
                        success: false,
                        error: error.message || 'Failed to upload avatar',
                };
        }
};

/**
 * Complete avatar selection and upload flow
 */
export const selectAndUploadAvatar = async (): Promise<AvatarUploadResult> => {
        try {
                // Step 1: Select image source
                const source = await selectImageSource();
                if (!source) {
                        return { success: false, error: 'Cancelled' };
                }

                // Step 2: Get image based on source
                let imageAsset: Asset | null = null;
                if (source === 'camera') {
                        imageAsset = await takePhotoWithCamera();
                } else {
                        imageAsset = await pickImageFromGallery();
                }

                if (!imageAsset || !imageAsset.uri) {
                        return { success: false, error: 'No image selected' };
                }

                // Step 3: Upload to server
                const uploadResult = await uploadAvatar(imageAsset.uri);

                return uploadResult;
        } catch (error: any) {
                console.error('Error in selectAndUploadAvatar:', error);
                return {
                        success: false,
                        error: error.message || 'Failed to select and upload avatar',
                };
        }
};
