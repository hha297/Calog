import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PhysicalProfileScreen } from '../screens/PhysicalProfileScreen';
import { ProfileStackParamList } from '../types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
        return (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="PhysicalProfile" component={PhysicalProfileScreen} />
                </Stack.Navigator>
        );
};
