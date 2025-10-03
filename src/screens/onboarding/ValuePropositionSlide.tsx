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
                <View className="bg-background flex-1 px-8 pt-8">
                        {/* Header */}
                        <View className="pb-6">
                                <CText size="2xl" weight="bold" className="text-text-light mb-2 text-center">
                                        What Calog Offers
                                </CText>
                                <CText size="lg" className="text-text-muted text-center">
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
                                                        className="bg-surfacePrimary mb-4 rounded-xl p-6"
                                                >
                                                        <View className="flex-row items-start">
                                                                <View className="mr-4 rounded-lg bg-primary/20 p-3">
                                                                        <IconComponent size={24} color="#10B981" />
                                                                </View>
                                                                <View className="flex-1">
                                                                        <CText
                                                                                size="lg"
                                                                                weight="medium"
                                                                                className="text-text-light mb-2"
                                                                        >
                                                                                {feature.title}
                                                                        </CText>
                                                                        <CText
                                                                                size="base"
                                                                                className="text-text-muted leading-5"
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
