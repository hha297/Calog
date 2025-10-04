import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { CText } from '../ui/CText';
import { TextField } from '../ui/TextField';
import { User, Camera } from 'lucide-react-native';

export interface ProfileInfoViewProps {
        formValues: Record<string, any>;
        setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export const ProfileInfoView: React.FC<ProfileInfoViewProps> = ({ formValues, setFormValues }) => {
        const handleAvatarChange = () => {
                // TODO: Implement image picker
        };

        return (
                <View>
                        {/* Avatar Section */}
                        <View className="mb-6">
                                <CText className="text-text-light mb-3" weight="medium">
                                        Profile Picture
                                </CText>
                                <View className="items-center">
                                        <TouchableOpacity
                                                className="relative h-24 w-24 items-center justify-center rounded-full bg-primary"
                                                onPress={handleAvatarChange}
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
                                                        <Camera size={16} color="#FFFFFF" />
                                                </View>
                                        </TouchableOpacity>
                                        <CText className="text-text-muted mt-2 text-center text-sm">
                                                Tap to change profile picture
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
