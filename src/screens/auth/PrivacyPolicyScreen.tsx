import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';

interface PrivacyPolicyScreenProps {
        navigation: any;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
        return (
                <SafeAreaView className="bg-background flex-1">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Header */}
                                        <View className="mb-8">
                                                <CText
                                                        size="2xl"
                                                        weight="bold"
                                                        className="text-text-light mb-2 text-center"
                                                >
                                                        Privacy Policy
                                                </CText>
                                                <CText className="text-text-muted text-center">
                                                        Last updated: {new Date().toLocaleDateString()}
                                                </CText>
                                        </View>

                                        {/* Content */}
                                        <View className="mb-6">
                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Introduction
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        Calog ("we," "our," or "us") is committed to protecting your
                                                        privacy. This Privacy Policy explains how your personal
                                                        information is collected, used, and disclosed by Calog when you
                                                        use our mobile application.
                                                </CText>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Information We Collect
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        We collect information you provide directly to us, such as when
                                                        you create an account, use our services, or contact us for
                                                        support:
                                                </CText>
                                                <View className="mb-4 ml-4">
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Account information (name, email address, password)
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Profile information (profile picture, preferences)
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Health and fitness data (food logs, workout records)
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Device information (device type, operating system)
                                                        </CText>
                                                </View>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        How We Use Your Information
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        We use the information we collect to:
                                                </CText>
                                                <View className="mb-4 ml-4">
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Provide, maintain, and improve our services
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Process transactions and send related information
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Send technical notices, updates, and support messages
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Respond to your comments and questions
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Monitor and analyze trends and usage
                                                        </CText>
                                                </View>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Information Sharing
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        We do not sell, trade, or otherwise transfer your personal
                                                        information to third parties without your consent, except in the
                                                        following circumstances:
                                                </CText>
                                                <View className="mb-4 ml-4">
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • With your explicit consent
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • To comply with legal obligations
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • To protect our rights and prevent fraud
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • With service providers who assist us in operating our
                                                                app
                                                        </CText>
                                                </View>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Data Security
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        We implement appropriate security measures to protect your
                                                        personal information against unauthorized access, alteration,
                                                        disclosure, or destruction. However, no method of transmission
                                                        over the internet is 100% secure.
                                                </CText>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Third-Party Services
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        Our app may contain links to third-party websites or services.
                                                        We are not responsible for the privacy practices of these third
                                                        parties. We encourage you to read their privacy policies.
                                                </CText>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Google Sign-In
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        When you sign in with Google, we collect your Google profile
                                                        information (name, email, profile picture) as provided by
                                                        Google. This information is used to create and manage your Calog
                                                        account.
                                                </CText>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Your Rights
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        You have the right to:
                                                </CText>
                                                <View className="mb-4 ml-4">
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Access and update your personal information
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Delete your account and associated data
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Opt out of certain communications
                                                        </CText>
                                                        <CText className="text-text-muted text-sm leading-6">
                                                                • Request a copy of your data
                                                        </CText>
                                                </View>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Children's Privacy
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        Our service is not intended for children under 13. We do not
                                                        knowingly collect personal information from children under 13.
                                                </CText>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Changes to This Policy
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        We may update this Privacy Policy from time to time. We will
                                                        notify you of any changes by posting the new Privacy Policy on
                                                        this page and updating the "Last updated" date.
                                                </CText>

                                                <CText className="text-text-light mb-4 text-lg" weight="bold">
                                                        Contact Us
                                                </CText>
                                                <CText className="text-text-muted mb-4 text-sm leading-6">
                                                        If you have any questions about this Privacy Policy, please
                                                        contact us at privacy@calog.app
                                                </CText>
                                        </View>

                                        {/* Back Button */}
                                        <Button title="Back" onPress={() => navigation.goBack()} className="mb-4" />
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
