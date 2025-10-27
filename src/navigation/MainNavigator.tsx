import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DiaryScreen } from '../screens/home/DiaryScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { CalendarTrackingScreen } from '../screens/home/CalendarTrackingScreen';
import { AccountNavigator } from './AccountNavigator';
import LottieView from 'lottie-react-native';
import { BookOpenIcon, ChartNoAxesCombinedIcon, HeadphonesIcon, UserRoundIcon, ScanLine } from 'lucide-react-native';
import { useTheme } from '../contexts';
import { COLORS } from '../style/color';

const DiaryStack = createNativeStackNavigator();

// Diary Stack Navigator
const DiaryStackNavigator = () => {
        return (
                <DiaryStack.Navigator screenOptions={{ headerShown: false }}>
                        <DiaryStack.Screen name="DiaryMain" component={DiaryScreen} />
                        <DiaryStack.Screen name="CalendarTracking" component={CalendarTrackingScreen} />
                </DiaryStack.Navigator>
        );
};

interface IconButtonProps {
        icon: React.ComponentType<any>;
        isActive: boolean;
        onPress: () => void;
        isDark: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ icon: IconComponent, isActive, onPress, isDark }) => {
        return (
                <TouchableOpacity
                        className={`size-14 items-center justify-center rounded-full ${isActive ? 'bg-primary' : 'bg-surfaceSecondary dark:bg-surfaceSecondary-dark'}`}
                        onPress={onPress}
                >
                        <IconComponent
                                size={24}
                                color={
                                        isActive
                                                ? COLORS.ICON_LIGHT
                                                : isDark
                                                  ? COLORS.TEXT_PRIMARY_DARK
                                                  : COLORS.TEXT_PRIMARY_LIGHT
                                }
                                strokeWidth={isActive ? 1 : 1}
                        />
                </TouchableOpacity>
        );
};

// Custom Scan Button
const ScanButton: React.FC<{ onPress: () => void; isActive: boolean; isDark: boolean }> = ({
        onPress,
        isActive = false,
        isDark,
}) => {
        const scanColor = isActive ? COLORS.ICON_LIGHT : isDark ? COLORS.TEXT_PRIMARY_DARK : COLORS.TEXT_PRIMARY_LIGHT;

        return (
                <TouchableOpacity
                        onPress={onPress}
                        className={`size-14 items-center justify-center rounded-full ${isActive ? 'bg-primary' : 'bg-surfaceSecondary dark:bg-surfaceSecondary-dark'}`}
                >
                        {isDark ? (
                                <LottieView
                                        source={require('../assets/images/scan.json')}
                                        autoPlay
                                        loop
                                        colorFilters={[
                                                {
                                                        keypath: 'Outer shape.Shapes.Stroke 1',
                                                        color: scanColor,
                                                },
                                                {
                                                        keypath: 'Scanner.Shapes.Stroke 1',
                                                        color: scanColor,
                                                },
                                        ]}
                                        style={{ width: 48, height: 48 }}
                                />
                        ) : (
                                <ScanLine size={24} color={scanColor} strokeWidth={1} />
                        )}
                </TouchableOpacity>
        );
};

export const MainNavigator: React.FC = () => {
        const { isDark } = useTheme();
        const [activeTab, setActiveTab] = useState<'diary' | 'analytics' | 'scan' | 'help' | 'account'>('diary');
        const [isScanning, setIsScanning] = useState(false);

        const handleTabPress = (tab: 'diary' | 'analytics' | 'scan' | 'help' | 'account') => {
                setActiveTab(tab);
        };

        const renderContent = () => {
                switch (activeTab) {
                        case 'diary':
                                return <DiaryStackNavigator />;
                        case 'analytics':
                                return <AnalyticsScreen />;
                        case 'scan':
                                return <ScanScreen navigation={{}} onScanningChange={setIsScanning} />;
                        case 'help':
                                return <HelpScreen />;
                        case 'account':
                                return <AccountNavigator />;
                        default:
                                return <DiaryStackNavigator />;
                }
        };

        return (
                <View className="flex-1 bg-background" pointerEvents="box-none">
                        {renderContent()}
                        <View
                                className="h-25 absolute bottom-0 left-0 right-0 items-center pb-12"
                                pointerEvents="box-none"
                                style={{ display: isScanning ? 'none' : 'flex' }}
                        >
                                <View className="z-[1000] mx-4">
                                        <View className="flex-row items-center justify-between gap-3 rounded-full bg-surfacePrimary p-3 dark:bg-surfacePrimary-dark">
                                                <IconButton
                                                        icon={BookOpenIcon}
                                                        isActive={activeTab === 'diary'}
                                                        onPress={() => handleTabPress('diary')}
                                                        isDark={isDark}
                                                />
                                                <IconButton
                                                        icon={ChartNoAxesCombinedIcon}
                                                        isActive={activeTab === 'analytics'}
                                                        onPress={() => handleTabPress('analytics')}
                                                        isDark={isDark}
                                                />
                                                <ScanButton
                                                        onPress={() => handleTabPress('scan')}
                                                        isActive={activeTab === 'scan'}
                                                        isDark={isDark}
                                                />
                                                <IconButton
                                                        icon={HeadphonesIcon}
                                                        isActive={activeTab === 'help'}
                                                        onPress={() => handleTabPress('help')}
                                                        isDark={isDark}
                                                />
                                                <IconButton
                                                        icon={UserRoundIcon}
                                                        isActive={activeTab === 'account'}
                                                        onPress={() => handleTabPress('account')}
                                                        isDark={isDark}
                                                />
                                        </View>
                                </View>
                        </View>
                </View>
        );
};
