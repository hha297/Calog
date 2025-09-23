import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { OAuthButton } from '../../components/ui/OAuthButton';
import { CText } from '../../components/ui/CText';
import { validateLoginForm, LoginFormData, LoginFormErrors } from '../../utils/authValidation';
import AntDesign from '@react-native-vector-icons/ant-design';

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
                                                                Welcome Back
                                                        </CText>
                                                        <CText size="base" className="text-center text-text-muted">
                                                                Sign in to your account
                                                        </CText>
                                                </View>

                                                {/* Form */}
                                                <View className="mb-6">
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
                                                                placeholder="Enter your password"
                                                                value={formData.password}
                                                                onChangeText={(value) =>
                                                                        handleInputChange('password', value)
                                                                }
                                                                error={errors.password}
                                                                secureTextEntry
                                                        />
                                                </View>

                                                {/* Login Button */}
                                                <Button
                                                        title="Sign In"
                                                        onPress={handleLogin}
                                                        loading={isLoading}
                                                        className="mb-4"
                                                />

                                                {/* Forgot Password Link */}
                                                <TouchableOpacity
                                                        onPress={() => navigation.navigate('ForgotPassword')}
                                                        className="mb-6"
                                                >
                                                        <CText className="text-center text-tertiary">
                                                                Forgot password?
                                                        </CText>
                                                </TouchableOpacity>

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

                                                {/* Sign Up Link */}
                                                <View className="flex-row justify-center">
                                                        <CText className="text-text-muted">
                                                                Don't have an account?{' '}
                                                        </CText>
                                                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                                                <CText className="text-tertiary">Sign up</CText>
                                                        </TouchableOpacity>
                                                </View>
                                        </View>
                                </ScrollView>
                        </KeyboardAvoidingView>
                </SafeAreaView>
        );
};
