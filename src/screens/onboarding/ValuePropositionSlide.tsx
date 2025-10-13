import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';
import { Smartphone, BarChart3, Bot } from 'lucide-react-native';

interface ValuePropositionSlideProps {
        onNext?: () => void;
        onDataChange?: (data: any) => void;
        profileData?: any;
}

const features = [
        {
                id: 1,
                title: 'Track with ease',
                subtitle: 'Scan barcodes, log meals manually, or choose from our food database.',
                icon: Smartphone,
        },
        {
                id: 2,
                title: 'Stay on top of progress',
                subtitle: 'Check your daily and weekly summaries anytime.',
                icon: BarChart3,
        },
        {
                id: 3,
                title: 'Smarter insights',
                subtitle: 'Get personalized feedback from your AI Nutrition Coach.',
                icon: Bot,
        },
];

export const ValuePropositionSlide: React.FC<ValuePropositionSlideProps> = ({ onNext }) => {
        return (
                <View className="flex-1 bg-surfacePrimary px-8 pt-8 dark:bg-background-dark">
                        {/* Header */}
                        <View className="pb-6">
                                <CText
                                        size="2xl"
                                        weight="bold"
                                        className="mb-2 text-center text-textPrimary dark:text-white"
                                >
                                        What Calog Offers
                                </CText>
                                <CText size="lg" className="text-center text-textSecondary dark:text-gray-300">
                                        Everything you need to reach your nutrition goals
                                </CText>
                        </View>

                        {/* Features List */}
                        <ScrollView
                                className="flex-1"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                        >
                                {features.map((feature) => {
                                        const IconComponent = feature.icon;
                                        return (
                                                <View
                                                        key={feature.id}
                                                        className="mt-4 rounded-xl bg-background p-6 dark:bg-surfacePrimary-dark"
                                                >
                                                        <View className="flex-row items-start">
                                                                <View className="mr-4 rounded-lg bg-primary/20 p-3 dark:bg-primary/30">
                                                                        <IconComponent size={24} color="#4CAF50" />
                                                                </View>
                                                                <View className="flex-1">
                                                                        <CText
                                                                                size="lg"
                                                                                weight="medium"
                                                                                className="mb-2 !text-surfacePrimary"
                                                                        >
                                                                                {feature.title}
                                                                        </CText>
                                                                        <CText
                                                                                size="base"
                                                                                className="leading-5 !text-textSecondary dark:!text-gray-300"
                                                                        >
                                                                                {feature.subtitle}
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                </View>
                                        );
                                })}
                        </ScrollView>
                </View>
        );
};
