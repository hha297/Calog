import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { OAuthButton } from '../../components/ui/OAuthButton';
import { CText } from '../../components/ui/CText';
import { Logo } from '../../components/ui/Logo';
import { validateLoginForm, LoginFormData, LoginFormErrors } from '../../utils/authValidation';
import { useLoginMutation, useGoogleLoginMutation } from '../../hooks/useAuth';
import { useAuthStore } from '../../store';

interface LoginScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
        const [formData, setFormData] = useState<LoginFormData>({
                email: '',
                password: '',
        });
        const [errors, setErrors] = useState<LoginFormErrors>({});
        const [rememberMe, setRememberMe] = useState(false);

        const { clearError } = useAuthStore();
        const loginMutation = useLoginMutation();
        const googleLoginMutation = useGoogleLoginMutation();

        // Clear errors and form data when screen comes into focus
        useFocusEffect(
                React.useCallback(() => {
                        setErrors({});
                        setFormData({ email: '', password: '' });
                        setRememberMe(false);
                        clearError();
                }, [clearError]),
        );

        const handleInputChange = (field: keyof LoginFormData, value: string) => {
                setFormData((prev) => ({ ...prev, [field]: value }));
                // Clear error when user starts typing
                if (errors[field]) {
                        setErrors((prev) => ({ ...prev, [field]: undefined }));
                }
        };

        const handleLogin = async () => {
                const validation = validateLoginForm(formData);
                if (!validation.isValid) {
                        setErrors(validation.errors);
                        return;
                }

                try {
                        await loginMutation.mutateAsync({
                                ...formData,
                                rememberMe,
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
                                        showsVerticalScrollIndicator={false}
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
                                                        Welcome Back
                                                </CText>
                                                <CText size="base" className="text-text-muted text-center">
                                                        Consistency builds strength – log in and keep pushing forward.
                                                </CText>
                                        </View>

                                        {/* Form */}
                                        <View className="mb-6">
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
                                                        placeholder="Enter your password"
                                                        value={formData.password}
                                                        onChangeText={(value) => handleInputChange('password', value)}
                                                        error={errors.password}
                                                        secureTextEntry
                                                />
                                        </View>

                                        {/* Login Button */}
                                        <Button
                                                title="Sign In"
                                                onPress={handleLogin}
                                                loading={loginMutation.isPending}
                                                disabled={
                                                        !formData.email.trim() ||
                                                        !formData.password.trim() ||
                                                        loginMutation.isPending
                                                }
                                                className="mb-4"
                                        />

                                        {/* Remember Me & Forgot Password */}
                                        <View className="mb-4 mt-3 flex-row items-center justify-between">
                                                {/* Remember Me */}
                                                <TouchableOpacity
                                                        className="flex-row items-center"
                                                        onPress={() => setRememberMe(!rememberMe)}
                                                >
                                                        <View
                                                                className={`mr-2 h-5 w-5 items-center justify-center rounded border-2 ${
                                                                        rememberMe
                                                                                ? 'border-tertiary bg-tertiary'
                                                                                : 'border-gray-300'
                                                                }`}
                                                        >
                                                                {rememberMe && (
                                                                        <CText className="text-xs text-white">✓</CText>
                                                                )}
                                                        </View>
                                                        <CText className="text-text-muted">Remember me</CText>
                                                </TouchableOpacity>

                                                {/* Forgot Password */}
                                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                                        <CText className="!text-tertiary" weight="medium">
                                                                Forgot password?
                                                        </CText>
                                                </TouchableOpacity>
                                        </View>

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

                                        {/* Sign Up Link */}
                                        <View className="flex-row justify-center">
                                                <CText className="text-text-muted">Don't have an account? </CText>
                                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                                        <CText className="!text-tertiary" weight="medium">
                                                                Sign up
                                                        </CText>
                                                </TouchableOpacity>
                                        </View>
                                </ScrollView>
                        </KeyboardAvoidingView>
                </SafeAreaView>
        );
};
