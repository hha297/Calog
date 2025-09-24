import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
        return (
                <Stack.Navigator
                        initialRouteName="Login"
                        screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: '#142b30' }, // primary color
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
                </Stack.Navigator>
        );
};
