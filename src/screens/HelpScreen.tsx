import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Linking, TextInput, TextStyle, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, Lightbulb, ChevronUp, Search, SendHorizonalIcon } from 'lucide-react-native';
import { CText } from '../components/ui/CText';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthStore } from '../store';
import { useTheme } from '../contexts';
import { FAQS, FAQ } from '../constants/faqs';
import { COLORS } from '../style/color';

export const HelpScreen: React.FC = () => {
        const { profile } = useUserProfile();
        const { user } = useAuthStore();
        const { isDark } = useTheme();
        const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
        const [searchQuery, setSearchQuery] = useState('');
        const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>(FAQS);

        // Initialize with all FAQs
        React.useEffect(() => {
                setFilteredFAQs(FAQS);
        }, []);

        const userName = user?.fullName || user?.name || 'User';
        const textSecondaryColor = isDark ? COLORS.TEXT_SECONDARY_DARK : COLORS.TEXT_SECONDARY_LIGHT;

        // Calculate max height as percentage of screen height
        const screenHeight = Dimensions.get('window').height;
        const maxHeight = screenHeight * 0.55; // 55% of screen height

        const handleSearch = (text: string) => {
                setSearchQuery(text);
                if (text.trim() === '') {
                        setFilteredFAQs(FAQS);
                } else {
                        const filtered = FAQS.filter(
                                (faq) =>
                                        faq.question.toLowerCase().includes(text.toLowerCase()) ||
                                        faq.answer.toLowerCase().includes(text.toLowerCase()),
                        );
                        setFilteredFAQs(filtered);
                }
        };

        const handleLinkPress = (url: string) => {
                Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
        };

        const toggleFAQ = (id: string) => {
                setExpandedFAQ(expandedFAQ === id ? null : id);
        };

        const handleActionButton = () => {
                const url = 'https://www.linkedin.com/in/hha297/';
                Linking.openURL(url).catch((err) => console.error('Failed to open LinkedIn:', err));
        };

        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
                                {/* Header */}
                                <View className="mb-6">
                                        <CText size="2xl" weight="bold" className="mb-2">
                                                Hello, {userName}!
                                        </CText>
                                        <CText
                                                size="base"
                                                className="mb-2 text-textSecondary dark:text-textSecondary-dark"
                                        >
                                                What do you need help with?
                                        </CText>
                                </View>

                                {/* Action Buttons */}
                                <View className="mb-6 flex-col gap-3">
                                        {/* Report Issue */}
                                        <TouchableOpacity
                                                onPress={handleActionButton}
                                                className="flex-1 flex-row items-center justify-between rounded-xl bg-surfaceSecondary p-4 dark:bg-surfaceSecondary-dark"
                                        >
                                                <View className="flex-row items-center gap-3">
                                                        <AlertCircle size={20} color={COLORS.ERROR} />
                                                        <CText weight="medium">Report Issue</CText>
                                                </View>
                                                <SendHorizonalIcon size={16} color={COLORS.SUCCESS} />
                                        </TouchableOpacity>

                                        {/* Feature Request */}
                                        <TouchableOpacity
                                                onPress={handleActionButton}
                                                className="flex-1 flex-row items-center justify-between rounded-xl bg-surfaceSecondary p-4 dark:bg-surfaceSecondary-dark"
                                        >
                                                <View className="flex-row items-center gap-3">
                                                        <Lightbulb size={20} color={COLORS.WARNING} />
                                                        <CText weight="medium">Feature Request</CText>
                                                </View>
                                                <SendHorizonalIcon size={16} color={COLORS.SUCCESS} />
                                        </TouchableOpacity>
                                </View>

                                {/* Search and FAQ Section */}
                                <View
                                        className="border-t-xl mb-6 w-full overflow-hidden rounded-2xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark"
                                        style={{ height: maxHeight, minHeight: 300 }}
                                >
                                        {/* Search Bar */}
                                        <View className="mb-4 flex-row items-center gap-3 rounded-xl bg-surfaceSecondary px-4 py-3 dark:bg-surfaceSecondary-dark">
                                                <Search size={20} color={textSecondaryColor} />
                                                <TextInput
                                                        style={[{ fontFamily: 'SpaceGrotesk-Regular' } as TextStyle]}
                                                        value={searchQuery}
                                                        onChangeText={handleSearch}
                                                        placeholder="Enter keywords or questions to find"
                                                        placeholderTextColor={textSecondaryColor}
                                                        className="flex-1 text-textPrimary dark:text-textPrimary-dark"
                                                />
                                        </View>

                                        {/* FAQ List (scrolls within locked height) */}
                                        <View className="w-full flex-1">
                                                <ScrollView
                                                        nestedScrollEnabled
                                                        className="flex-1"
                                                        showsVerticalScrollIndicator={false}
                                                >
                                                        {filteredFAQs.length === 0 ? (
                                                                <View className="items-center py-8">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                No results found
                                                                        </CText>
                                                                </View>
                                                        ) : (
                                                                filteredFAQs.map((faq) => {
                                                                        const isExpanded = expandedFAQ === faq.id;
                                                                        return (
                                                                                <TouchableOpacity
                                                                                        key={faq.id}
                                                                                        onPress={() =>
                                                                                                toggleFAQ(faq.id)
                                                                                        }
                                                                                        className="mb-3 w-full rounded-xl bg-surfaceSecondary p-4 dark:bg-surfaceSecondary-dark"
                                                                                >
                                                                                        <View className="flex-row items-center justify-between">
                                                                                                <CText
                                                                                                        weight="medium"
                                                                                                        className="flex-1 basis-0 pr-2"
                                                                                                >
                                                                                                        {faq.question}
                                                                                                </CText>
                                                                                                <ChevronUp
                                                                                                        size={20}
                                                                                                        color={
                                                                                                                textSecondaryColor
                                                                                                        }
                                                                                                        style={{
                                                                                                                transform: [
                                                                                                                        {
                                                                                                                                rotateZ: isExpanded
                                                                                                                                        ? '0deg'
                                                                                                                                        : '180deg',
                                                                                                                        },
                                                                                                                ],
                                                                                                        }}
                                                                                                />
                                                                                        </View>

                                                                                        {isExpanded && (
                                                                                                <View className="mt-3 w-full border-t pt-3">
                                                                                                        <View className="w-full flex-shrink">
                                                                                                                <CText className="leading-6 text-textSecondary dark:text-textSecondary-dark">
                                                                                                                        {
                                                                                                                                faq.answer
                                                                                                                        }
                                                                                                                </CText>
                                                                                                                {faq.link && (
                                                                                                                        <TouchableOpacity
                                                                                                                                onPress={() =>
                                                                                                                                        handleLinkPress(
                                                                                                                                                faq.link!,
                                                                                                                                        )
                                                                                                                                }
                                                                                                                                className="mt-3"
                                                                                                                        >
                                                                                                                                <CText className="!text-primary">
                                                                                                                                        Learn
                                                                                                                                        more
                                                                                                                                        →
                                                                                                                                </CText>
                                                                                                                        </TouchableOpacity>
                                                                                                                )}
                                                                                                        </View>
                                                                                                </View>
                                                                                        )}
                                                                                </TouchableOpacity>
                                                                        );
                                                                })
                                                        )}
                                                </ScrollView>
                                        </View>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
