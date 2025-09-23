import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { OAuthButton } from '../../components/ui/OAuthButton';
import { CText } from '../../components/ui/CText';
import { validateSignupForm, SignupFormData, SignupFormErrors } from '../../utils/authValidation';
import AntDesign from '@react-native-vector-icons/ant-design';

interface SignupScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
        const [formData, setFormData] = useState<SignupFormData>({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
        });
        const [errors, setErrors] = useState<SignupFormErrors>({});
        const [isLoading, setIsLoading] = useState(false);

        const handleInputChange = (field: keyof SignupFormData, value: string) => {
                setFormData((prev) => ({ ...prev, [field]: value }));
                // Clear error when user starts typing
                if (errors[field]) {
                        setErrors((prev) => ({ ...prev, [field]: undefined }));
                }
        };

        const handleSignup = async () => {
                // TODO: wire to real endpoint
                // TODO: persist token with SecureStore/Keychain
                // TODO: add JWT refresh + logout flow

                const validation = validateSignupForm(formData);
                if (!validation.isValid) {
                        setErrors(validation.errors);
                        return;
                }

                setIsLoading(true);

                // Mock API call
                setTimeout(() => {
                        setIsLoading(false);
                        // Navigate to Profile screen
                        navigation.navigate('Profile');
                }, 1500);
        };

        const handleGoogleAuth = () => {
                // TODO: Implement Google OAuth with react-native-app-auth
                console.log('Google OAuth - UI only');
        };

        const handleAppleAuth = () => {
                // TODO: Implement Apple OAuth with react-native-app-auth
                console.log('Apple OAuth - UI only');
        };

        const handleFacebookAuth = () => {
                // TODO: Implement Facebook OAuth with react-native-app-auth
                console.log('Facebook OAuth - UI only');
        };

        return (
                <SafeAreaView className="flex-1 bg-primary">
                        <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                className="flex-1"
                        >
                                <ScrollView
                                        className="flex-1 px-6"
                                        contentContainerStyle={{ flexGrow: 1 }}
                                        keyboardShouldPersistTaps="handled"
                                >
                                        {/* Logo */}
                                        <View className="mb-6 mt-4">
                                                <AntDesign name="book" size={24} color="#4CAF50" />
                                        </View>

                                        <View className="flex-1 justify-center py-8">
                                                {/* Header */}
                                                <View className="mb-8">
                                                        <CText
                                                                size="3xl"
                                                                weight="bold"
                                                                className="mb-2 text-center text-text-light"
                                                        >
                                                                Create Account
                                                        </CText>
                                                        <CText size="base" className="text-center text-text-muted">
                                                                Join us today
                                                        </CText>
                                                </View>

                                                {/* Form */}
                                                <View className="mb-6">
                                                        <TextField
                                                                label="Full Name"
                                                                placeholder="Enter your full name"
                                                                value={formData.name}
                                                                onChangeText={(value) =>
                                                                        handleInputChange('name', value)
                                                                }
                                                                error={errors.name}
                                                                autoCapitalize="words"
                                                        />

                                                        <TextField
                                                                label="Email"
                                                                placeholder="Enter your email"
                                                                value={formData.email}
                                                                onChangeText={(value) =>
                                                                        handleInputChange('email', value)
                                                                }
                                                                error={errors.email}
                                                                keyboardType="email-address"
                                                                autoCapitalize="none"
                                                        />

                                                        <TextField
                                                                label="Password"
                                                                placeholder="Create a password"
                                                                value={formData.password}
                                                                onChangeText={(value) =>
                                                                        handleInputChange('password', value)
                                                                }
                                                                error={errors.password}
                                                                secureTextEntry
                                                        />

                                                        <TextField
                                                                label="Confirm Password"
                                                                placeholder="Confirm your password"
                                                                value={formData.confirmPassword}
                                                                onChangeText={(value) =>
                                                                        handleInputChange('confirmPassword', value)
                                                                }
                                                                error={errors.confirmPassword}
                                                                secureTextEntry
                                                        />
                                                </View>

                                                {/* Signup Button */}
                                                <Button
                                                        title="Create Account"
                                                        onPress={handleSignup}
                                                        loading={isLoading}
                                                        className="mb-6"
                                                />

                                                {/* Divider */}
                                                <View className="mb-6 flex-row items-center">
                                                        <View className="h-px flex-1 bg-gray-600" />
                                                        <CText className="mx-4 text-text-muted">OR</CText>
                                                        <View className="h-px flex-1 bg-gray-600" />
                                                </View>

                                                {/* OAuth Buttons */}
                                                <View className="mb-6">
                                                        <CText className="mb-3 text-center text-text-muted">
                                                                Or continue with
                                                        </CText>
                                                        <View className="flex-row justify-between">
                                                                <OAuthButton
                                                                        provider="google"
                                                                        onPress={handleGoogleAuth}
                                                                        className="mr-2 flex-1"
                                                                />
                                                                <OAuthButton
                                                                        provider="apple"
                                                                        onPress={handleAppleAuth}
                                                                        className="mx-1 flex-1"
                                                                />
                                                                <OAuthButton
                                                                        provider="facebook"
                                                                        onPress={handleFacebookAuth}
                                                                        className="ml-2 flex-1"
                                                                />
                                                        </View>
                                                </View>

                                                {/* Login Link */}
                                                <View className="flex-row justify-center">
                                                        <CText className="text-text-muted">
                                                                Already have an account?{' '}
                                                        </CText>
                                                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                                                <CText className="text-tertiary">Sign in</CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </View>
                                </ScrollView>
                        </KeyboardAvoidingView>
                </SafeAreaView>
        );
};
