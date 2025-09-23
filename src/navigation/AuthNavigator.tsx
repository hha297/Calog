import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type AuthStackParamList = {
        Login: undefined;
        Signup: undefined;
        ForgotPassword: undefined;
        Profile: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
        return (
                <NavigationContainer>
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
                                <Stack.Screen
                                        name="Profile"
                                        component={ProfileScreen}
                                        options={{
                                                title: 'Profile',
                                                headerShown: true,
                                                headerStyle: {
                                                        backgroundColor: '#142b30',
                                                },
                                                headerTintColor: '#FFFFFF',
                                                headerTitleStyle: {
                                                        fontFamily: 'SpaceGrotesk-Medium',
                                                },
                                        }}
                                />
                        </Stack.Navigator>
                </NavigationContainer>
        );
};
