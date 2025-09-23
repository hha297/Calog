import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { OAuthButton } from '../../components/ui/OAuthButton';
import { CText } from '../../components/ui/CText';
import { Logo } from '../../components/ui/Logo';
import { validateSignupForm, SignupFormData, SignupFormErrors } from '../../utils/authValidation';

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

        // Clear errors and form data when component mounts
        useEffect(() => {
                setErrors({});
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        }, []);

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

        return (
                <SafeAreaView className="flex-1 bg-primary">
                        <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                className="flex-1"
                                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                        >
                                <ScrollView
                                        className="flex-1 px-6"
                                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                                        keyboardShouldPersistTaps="handled"
                                >
                                        {/* Logo */}
                                        <View className="my-4 items-center pt-8">
                                                <Logo size={96} />
                                        </View>

                                        {/* Header */}
                                        <View className="mb-8">
                                                <CText
                                                        size="2xl"
                                                        weight="bold"
                                                        className="mb-2 text-center text-text-light"
                                                >
                                                        Start Your Journey
                                                </CText>
                                                <CText size="base" className="text-center text-text-muted">
                                                        Join Calog to track your nutrition, workouts, and progress – all
                                                        in one place.
                                                </CText>
                                        </View>

                                        {/* Form */}
                                        <View className="mb-6">
                                                <TextField
                                                        label="Full Name"
                                                        placeholder="Enter your full name"
                                                        value={formData.name}
                                                        onChangeText={(value) => handleInputChange('name', value)}
                                                        error={errors.name}
                                                        autoCapitalize="words"
                                                />

                                                <TextField
                                                        label="Email"
                                                        placeholder="Enter your email"
                                                        value={formData.email}
                                                        onChangeText={(value) => handleInputChange('email', value)}
                                                        error={errors.email}
                                                        keyboardType="email-address"
                                                        autoCapitalize="none"
                                                />

                                                <TextField
                                                        label="Password"
                                                        placeholder="Create a password"
                                                        value={formData.password}
                                                        onChangeText={(value) => handleInputChange('password', value)}
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
                                                disabled={
                                                        !formData.name.trim() ||
                                                        !formData.email.trim() ||
                                                        !formData.password.trim() ||
                                                        !formData.confirmPassword.trim() ||
                                                        isLoading
                                                }
                                                className="mb-6"
                                        />

                                        {/* Divider */}
                                        <View className="mb-6 flex-row items-center">
                                                <View className="h-px flex-1 bg-white" />
                                                <CText className="mx-4 text-text-muted">OR</CText>
                                                <View className="h-px flex-1 bg-white" />
                                        </View>

                                        {/* OAuth Buttons */}
                                        <View className="mb-6">
                                                <CText className="mb-3 text-center text-text-muted">
                                                        Or continue with
                                                </CText>
                                                <OAuthButton provider="google" onPress={handleGoogleAuth} />
                                        </View>

                                        {/* Login Link */}
                                        <View className="flex-row justify-center">
                                                <CText className="text-text-muted">Already have an account? </CText>
                                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                                        <CText className="!text-tertiary" weight="medium">
                                                                Sign in
                                                        </CText>
                                                </TouchableOpacity>
                                        </View>
                                </ScrollView>
                        </KeyboardAvoidingView>
                </SafeAreaView>
        );
};
