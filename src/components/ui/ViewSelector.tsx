import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CText } from './CText';

interface ViewSelectorProps {
        selectedView: 'daily' | 'weekly';
        onViewChange: (view: 'daily' | 'weekly') => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({ selectedView, onViewChange }) => {
        return (
                <View className="mb-4 flex-row rounded-full bg-surfacePrimary p-1 dark:bg-surfacePrimary-dark">
                        <TouchableOpacity
                                className={`flex-1 rounded-full py-2 ${selectedView === 'daily' ? 'bg-primary' : ''}`}
                                onPress={() => onViewChange('daily')}
                        >
                                <CText
                                        weight="medium"
                                        className={`text-center ${
                                                selectedView === 'daily'
                                                        ? 'text-white'
                                                        : '!text-textPrimary dark:!text-textSecondary-dark'
                                        }`}
                                >
                                        Daily
                                </CText>
                        </TouchableOpacity>

                        <TouchableOpacity
                                className={`flex-1 rounded-full py-2 ${selectedView === 'weekly' ? 'bg-primary' : ''}`}
                                onPress={() => onViewChange('weekly')}
                        >
                                <CText
                                        weight="medium"
                                        className={`text-center ${
                                                selectedView === 'weekly'
                                                        ? 'text-white'
                                                        : '!text-textPrimary dark:!text-textSecondary-dark'
                                        }`}
                                >
                                        Weekly
                                </CText>
                        </TouchableOpacity>
                </View>
        );
};
