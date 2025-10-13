import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { validateEmail } from '../../utils/authValidation';
import { CText } from '../../components/ui/CText';
import { useTheme } from '../../contexts';

interface ForgotPasswordScreenProps {
        navigation: any; // TODO: Add proper navigation typing
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
        const { isDark } = useTheme();
        const [email, setEmail] = useState('');
        const [error, setError] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [isEmailSent, setIsEmailSent] = useState(false);

        // Clear errors and form data when component mounts
        useEffect(() => {
                setError('');
                setEmail('');
                setIsEmailSent(false);
        }, []);

        const handleInputChange = (value: string) => {
                setEmail(value);
                // Clear error when user starts typing
                if (error) {
                        setError('');
                }
        };

        const handleResetPassword = async () => {
                // TODO: wire to real endpoint
                // TODO: add proper error handling for network failures

                const validation = validateEmail(email);
                if (!validation.isValid) {
                        setError(validation.error || 'Invalid email');
                        return;
                }

                setIsLoading(true);

                // Mock API call
                setTimeout(() => {
                        setIsLoading(false);
                        setIsEmailSent(true);
                }, 1500);
        };

        const handleResendEmail = () => {
                setIsEmailSent(false);
                handleResetPassword();
        };

        if (isEmailSent) {
                return (
                        <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                                <View className="flex-1 justify-center px-6">
                                        {/* Success State */}
                                        <View className="mb-8 items-center">
                                                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary">
                                                        <CText className="text-2xl text-white">✓</CText>
                                                </View>
                                                <CText
                                                        weight="bold"
                                                        className={`mb-2 text-center text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}
                                                >
                                                        Check Your Email
                                                </CText>
                                                <CText
                                                        className={`mb-2 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                                                >
                                                        We've sent a password reset link to
                                                </CText>
                                                <CText className="text-center !text-primary">{email}</CText>
                                        </View>

                                        {/* Instructions */}
                                        <View className="mb-8">
                                                <CText
                                                        className={`mb-4 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                                >
                                                        Didn't receive the email? Check your spam folder or try again.
                                                </CText>
                                        </View>

                                        {/* Action Buttons */}
                                        <View className="space-y-3">
                                                <Button
                                                        title="Resend Email"
                                                        onPress={handleResendEmail}
                                                        variant="ghost"
                                                />
                                                <Button
                                                        title="Back to Sign In"
                                                        onPress={() => navigation.navigate('Login')}
                                                        variant="secondary"
                                                />
                                        </View>
                                </View>
                        </SafeAreaView>
                );
        }

        return (
                <SafeAreaView className="flex-1 bg-surfacePrimary dark:bg-background-dark">
                        <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                className="flex-1"
                        >
                                <ScrollView
                                        className="flex-1 px-6"
                                        contentContainerStyle={{ flexGrow: 1 }}
                                        keyboardShouldPersistTaps="handled"
                                >
                                        <View className="flex-1 justify-center py-8">
                                                {/* Header */}
                                                <View className="mb-8">
                                                        <CText
                                                                weight="bold"
                                                                className={`mb-2 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
                                                                size="3xl"
                                                        >
                                                                Forgot Password?
                                                        </CText>
                                                        <CText
                                                                className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                                                        >
                                                                We'll send you reset instructions to your email.
                                                        </CText>
                                                </View>

                                                {/* Form */}
                                                <View className="mb-6">
                                                        <TextField
                                                                label="Email"
                                                                placeholder="Enter your email address"
                                                                value={email}
                                                                onChangeText={handleInputChange}
                                                                error={error}
                                                                keyboardType="email-address"
                                                                autoCapitalize="none"
                                                        />
                                                </View>

                                                {/* Reset Button */}
                                                <Button
                                                        title="Send Reset Link"
                                                        onPress={handleResetPassword}
                                                        loading={isLoading}
                                                        disabled={!email.trim() || isLoading}
                                                        className="mb-6"
                                                />

                                                {/* Back to Login Link */}
                                                <TouchableOpacity
                                                        onPress={() => navigation.navigate('Login')}
                                                        className="items-center"
                                                >
                                                        <CText className="!text-primary">Back to Sign In</CText>
                                                </TouchableOpacity>
                                        </View>
                                </ScrollView>
                        </KeyboardAvoidingView>
                </SafeAreaView>
        );
};
