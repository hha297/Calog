import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountScreen } from '../screens/account/AccountScreen';
import { ProfileScreen } from '../screens/account/ProfileScreen';
import { AccountStackParamList } from '../types';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export const AccountNavigator: React.FC = () => {
        return (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Account" component={AccountScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                </Stack.Navigator>
        );
};
