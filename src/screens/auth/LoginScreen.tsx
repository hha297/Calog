import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { OAuthButton } from '../../components/ui/OAuthButton';
import { CText } from '../../components/ui/CText';
import { Logo } from '../../components/ui/Logo';
import { validateLoginForm, LoginFormData, LoginFormErrors } from '../../utils/authValidation';

interface LoginScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
        const [formData, setFormData] = useState<LoginFormData>({
                email: '',
                password: '',
        });
        const [errors, setErrors] = useState<LoginFormErrors>({});
        const [isLoading, setIsLoading] = useState(false);
        const [rememberMe, setRememberMe] = useState(false);

        // Clear errors and form data when screen comes into focus
        useFocusEffect(
                React.useCallback(() => {
                        setErrors({});
                        setFormData({ email: '', password: '' });
                        setRememberMe(false);
                }, []),
        );

        const handleInputChange = (field: keyof LoginFormData, value: string) => {
                setFormData((prev) => ({ ...prev, [field]: value }));
                // Clear error when user starts typing
                if (errors[field]) {
                        setErrors((prev) => ({ ...prev, [field]: undefined }));
                }
        };

        const handleLogin = async () => {
                // TODO: wire to real endpoint
                // TODO: persist token with SecureStore/Keychain
                // TODO: add JWT refresh + logout flow

                const validation = validateLoginForm(formData);
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
                                                        className="mb-2 text-center text-text-light"
                                                >
                                                        Welcome Back
                                                </CText>
                                                <CText size="base" className="text-center text-text-muted">
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
                                                loading={isLoading}
                                                disabled={
                                                        !formData.email.trim() || !formData.password.trim() || isLoading
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
