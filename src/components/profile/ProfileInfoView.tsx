import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { CText } from '../ui/CText';
import { TextField } from '../ui/TextField';
import { User, Camera } from 'lucide-react-native';
import { selectAndUploadAvatar } from '../../services/avatarService';

export interface ProfileInfoViewProps {
        formValues: Record<string, any>;
        setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
        onAvatarUploaded?: (avatarUrl: string) => void;
}

export const ProfileInfoView: React.FC<ProfileInfoViewProps> = ({ formValues, setFormValues, onAvatarUploaded }) => {
        const [isUploading, setIsUploading] = useState(false);

        const handleAvatarChange = async () => {
                setIsUploading(true);
                try {
                        const result = await selectAndUploadAvatar();

                        if (result.success && result.avatarUrl) {
                                // Update form values
                                setFormValues((prev) => ({
                                        ...prev,
                                        avatar: result.avatarUrl,
                                }));

                                // Notify parent component
                                if (onAvatarUploaded) {
                                        onAvatarUploaded(result.avatarUrl);
                                }

                                Alert.alert('Success', 'Avatar uploaded successfully!');
                        } else if (result.error && result.error !== 'Cancelled') {
                                Alert.alert('Error', result.error || 'Failed to upload avatar');
                        }
                } catch (error: any) {
                        Alert.alert('Error', error.message || 'Failed to upload avatar');
                } finally {
                        setIsUploading(false);
                }
        };

        return (
                <View>
                        {/* Avatar Section */}
                        <View className="mb-6">
                                <CText className="mb-3" weight="medium">
                                        Profile Picture
                                </CText>
                                <View className="items-center">
                                        <TouchableOpacity
                                                className="relative h-24 w-24 items-center justify-center rounded-full bg-primary"
                                                onPress={handleAvatarChange}
                                                disabled={isUploading}
                                        >
                                                {formValues.avatar ? (
                                                        <Image
                                                                source={{ uri: formValues.avatar }}
                                                                className="h-24 w-24 rounded-full"
                                                        />
                                                ) : (
                                                        <User size={48} color="#FFFFFF" />
                                                )}
                                                <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-green-500">
                                                        {isUploading ? (
                                                                <ActivityIndicator size="small" color="#FFFFFF" />
                                                        ) : (
                                                                <Camera size={16} color="#FFFFFF" />
                                                        )}
                                                </View>
                                        </TouchableOpacity>
                                        <CText className="mt-2 text-center text-sm">
                                                {isUploading ? 'Uploading...' : 'Tap to change profile picture'}
                                        </CText>
                                </View>
                        </View>

                        {/* Name Section */}
                        <View className="mb-6">
                                <TextField
                                        label="Full Name"
                                        value={formValues.name || ''}
                                        onChangeText={(text) =>
                                                setFormValues((prev) => ({
                                                        ...prev,
                                                        name: text,
                                                }))
                                        }
                                        placeholder="Enter your full name"
                                />
                        </View>
                </View>
        );
};
