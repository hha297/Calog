import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LogScreen } from '../screens/LogScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { MainStackParamList } from '../types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#142b30', // primary color
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'SpaceGrotesk-Medium',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Calog',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Log"
        component={LogScreen}
        options={{
          title: 'Food Log',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          title: 'Scan Food',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};
