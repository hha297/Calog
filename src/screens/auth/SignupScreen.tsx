import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { OAuthButton } from '../../components/ui/OAuthButton';
import { CText } from '../../components/ui/CText';
import { Logo } from '../../components/ui/Logo';
import { validateSignupForm, SignupFormData, SignupFormErrors } from '../../utils/authValidation';
import { useSignupMutation, useGoogleLoginMutation } from '../../hooks/useAuth';
import { useAuthStore } from '../../store';

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
        const [agreeToTerms, setAgreeToTerms] = useState(false);

        const { clearError } = useAuthStore();
        const signupMutation = useSignupMutation();
        const googleLoginMutation = useGoogleLoginMutation();

        // Clear errors and form data when component mounts
        useEffect(() => {
                setErrors({});
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                setAgreeToTerms(false);
                clearError();
        }, [clearError]);

        const handleInputChange = (field: keyof SignupFormData, value: string) => {
                setFormData((prev) => ({ ...prev, [field]: value }));
                // Clear error when user starts typing
                if (errors[field]) {
                        setErrors((prev) => ({ ...prev, [field]: undefined }));
                }
        };

        const handleSignup = async () => {
                if (!agreeToTerms) {
                        setErrors({ terms: 'You must agree to the Terms of Service and Privacy Policy' });
                        return;
                }

                const validation = validateSignupForm(formData);
                if (!validation.isValid) {
                        setErrors(validation.errors);
                        return;
                }

                try {
                        await signupMutation.mutateAsync({
                                fullName: formData.name,
                                email: formData.email,
                                password: formData.password,
                        });
                        // Navigation will be handled by the auth flow
                } catch (error) {
                        // Error is handled by the mutation and toast
                }
        };

        const handleGoogleAuth = async () => {
                try {
                        await googleLoginMutation.mutateAsync();
                        // Navigation will be handled by the auth flow
                } catch (error) {
                        // Error is handled by the mutation and toast
                }
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
                                                        className="text-text-light mb-2 text-center"
                                                >
                                                        Start Your Journey
                                                </CText>
                                                <CText size="base" className="text-text-muted text-center">
                                                        Join Calog to track your nutrition, workouts, and progress – all
                                                        in one place.
                                                </CText>
                                        </View>

                                        {/* Form */}
                                        <View className="mb-4">
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

                                        {/* Terms & Privacy Checkbox */}
                                        <View className="mb-6">
                                                <View className="flex-row items-center">
                                                        <TouchableOpacity
                                                                className="mr-3 mt-1"
                                                                onPress={() => setAgreeToTerms(!agreeToTerms)}
                                                        >
                                                                <View
                                                                        className={`h-5 w-5 items-center justify-center rounded border-2 ${
                                                                                agreeToTerms
                                                                                        ? 'border-tertiary bg-tertiary'
                                                                                        : 'border-gray-300'
                                                                        }`}
                                                                >
                                                                        {agreeToTerms && (
                                                                                <CText className="text-xs text-white">
                                                                                        ✓
                                                                                </CText>
                                                                        )}
                                                                </View>
                                                        </TouchableOpacity>
                                                        <View className="flex-1">
                                                                <View className="flex-row flex-wrap">
                                                                        <CText className="text-text-muted">
                                                                                I agree to{' '}
                                                                        </CText>
                                                                        <Pressable
                                                                                onPress={() => {
                                                                                        navigation.navigate(
                                                                                                'TermsOfService',
                                                                                        );
                                                                                }}
                                                                        >
                                                                                <CText
                                                                                        className="!text-tertiary"
                                                                                        weight="medium"
                                                                                >
                                                                                        Terms of Service
                                                                                </CText>
                                                                        </Pressable>
                                                                        <CText className="text-text-muted"> and </CText>
                                                                        <Pressable
                                                                                onPress={() => {
                                                                                        navigation.navigate(
                                                                                                'PrivacyPolicy',
                                                                                        );
                                                                                }}
                                                                        >
                                                                                <CText
                                                                                        className="!text-tertiary"
                                                                                        weight="medium"
                                                                                >
                                                                                        Privacy Policy
                                                                                </CText>
                                                                        </Pressable>
                                                                </View>
                                                                {errors.terms && (
                                                                        <CText className="mt-1 text-xs text-red-500">
                                                                                {errors.terms}
                                                                        </CText>
                                                                )}
                                                        </View>
                                                </View>
                                        </View>

                                        {/* Signup Button */}
                                        <Button
                                                title="Create Account"
                                                onPress={handleSignup}
                                                loading={signupMutation.isPending}
                                                disabled={
                                                        !formData.name.trim() ||
                                                        !formData.email.trim() ||
                                                        !formData.password.trim() ||
                                                        !formData.confirmPassword.trim() ||
                                                        !agreeToTerms ||
                                                        signupMutation.isPending
                                                }
                                                className="mb-6"
                                        />

                                        {/* Divider */}
                                        <View className="mb-6 flex-row items-center">
                                                <View className="h-px flex-1 bg-white" />
                                                <CText className="text-text-muted mx-4">OR</CText>
                                                <View className="h-px flex-1 bg-white" />
                                        </View>

                                        {/* OAuth Buttons */}
                                        <View className="mb-6">
                                                <OAuthButton
                                                        provider="google"
                                                        onPress={handleGoogleAuth}
                                                        disabled={googleLoginMutation.isPending}
                                                />
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
