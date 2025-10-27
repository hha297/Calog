import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { TermsOfServiceScreen } from '../screens/auth/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from '../screens/auth/PrivacyPolicyScreen';
import { AuthStackParamList } from '../types';
import { COLORS } from '../style/color';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
        return (
                <Stack.Navigator
                        initialRouteName="Login"
                        screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: COLORS.SECONDARY }, // primary color
                        }}
                >
                        <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                                options={{
                                        title: 'Sign In',
                                }}
                        />
                        <Stack.Screen
                                name="Signup"
                                component={SignupScreen}
                                options={{
                                        title: 'Create Account',
                                }}
                        />
                        <Stack.Screen
                                name="ForgotPassword"
                                component={ForgotPasswordScreen}
                                options={{
                                        title: 'Reset Password',
                                }}
                        />
                        <Stack.Screen
                                name="TermsOfService"
                                component={TermsOfServiceScreen}
                                options={{
                                        title: 'Terms of Service',
                                }}
                        />
                        <Stack.Screen
                                name="PrivacyPolicy"
                                component={PrivacyPolicyScreen}
                                options={{
                                        title: 'Privacy Policy',
                                }}
                        />
                </Stack.Navigator>
        );
};
