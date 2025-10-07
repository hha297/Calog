import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';

interface TermsOfServiceScreenProps {
        navigation: any;
}

export const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ navigation }) => {
        return (
                <SafeAreaView className="flex-1 bg-background">
                        <ScrollView className="flex-1 px-6">
                                <View className="py-8">
                                        {/* Header */}
                                        <View className="mb-8">
                                                <CText size="2xl" weight="bold" className="mb-2 text-center">
                                                        Terms of Service
                                                </CText>
                                                <CText className="text-center">
                                                        Last updated: {new Date().toLocaleDateString()}
                                                </CText>
                                        </View>

                                        {/* Content */}
                                        <View className="mb-6">
                                                <CText className="mb-4 text-lg" weight="bold">
                                                        1. Acceptance of Terms
                                                </CText>
                                                <CText className="mb-4 text-sm leading-6">
                                                        By accessing and using Calog, you accept and agree to be bound
                                                        by the terms and provision of this agreement. If you do not
                                                        agree to abide by the above, please do not use this service.
                                                </CText>

                                                <CText className="mb-4 text-lg" weight="bold">
                                                        2. Use License
                                                </CText>
                                                <CText className="mb-4 text-sm leading-6">
                                                        Permission is granted to temporarily download one copy of Calog
                                                        per device for personal, non-commercial transitory viewing only.
                                                        This is the grant of a license, not a transfer of title, and
                                                        under this license you may not:
                                                </CText>
                                                <View className="mb-4 ml-4">
                                                        <CText className="text-sm leading-6">
                                                                • modify or copy the materials
                                                        </CText>
                                                        <CText className="text-sm leading-6">
                                                                • use the materials for any commercial purpose or for
                                                                any public display
                                                        </CText>
                                                        <CText className="text-sm leading-6">
                                                                • attempt to reverse engineer any software contained in
                                                                the app
                                                        </CText>
                                                        <CText className="text-sm leading-6">
                                                                • remove any copyright or other proprietary notations
                                                                from the materials
                                                        </CText>
                                                </View>

                                                <CText className="mb-4 text-lg" weight="bold">
                                                        3. User Accounts
                                                </CText>
                                                <CText className="mb-4 text-sm leading-6">
                                                        When you create an account with us, you must provide information
                                                        that is accurate, complete, and current at all times. You are
                                                        responsible for safeguarding the password and for all activities
                                                        that occur under your account.
                                                </CText>

                                                <CText className="mb-4 text-lg" weight="bold">
                                                        4. Privacy Policy
                                                </CText>
                                                <CText className="mb-4 text-sm leading-6">
                                                        Your privacy is important to us. Please review our Privacy
                                                        Policy, which also governs your use of the Service, to
                                                        understand our practices.
                                                </CText>

                                                <CText className="mb-4 text-lg" weight="bold">
                                                        5. Prohibited Uses
                                                </CText>
                                                <CText className="mb-4 text-sm leading-6">
                                                        You may not use our Service:
                                                </CText>
                                                <View className="mb-4 ml-4">
                                                        <CText className="text-sm leading-6">
                                                                • For any unlawful purpose or to solicit others to
                                                                perform unlawful acts
                                                        </CText>
                                                        <CText className="text-sm leading-6">
                                                                • To violate any international, federal, provincial, or
                                                                state regulations, rules, laws, or local ordinances
                                                        </CText>
                                                        <CText className="text-sm leading-6">
                                                                • To infringe upon or violate our intellectual property
                                                                rights or the intellectual property rights of others
                                                        </CText>
                                                        <CText className="text-sm leading-6">
                                                                • To harass, abuse, insult, harm, defame, slander,
                                                                disparage, intimidate, or discriminate
                                                        </CText>
                                                </View>

                                                <CText className="mb-4 text-lg" weight="bold">
                                                        6. Termination
                                                </CText>
                                                <CText className="mb-4 text-sm leading-6">
                                                        We may terminate or suspend your account immediately, without
                                                        prior notice or liability, for any reason whatsoever, including
                                                        without limitation if you breach the Terms.
                                                </CText>

                                                <CText className="mb-4 text-lg" weight="bold">
                                                        7. Changes to Terms
                                                </CText>
                                                <CText className="mb-4 text-sm leading-6">
                                                        We reserve the right, at our sole discretion, to modify or
                                                        replace these Terms at any time. If a revision is material, we
                                                        will try to provide at least 30 days notice prior to any new
                                                        terms taking effect.
                                                </CText>

                                                <CText className="mb-4 text-lg" weight="bold">
                                                        8. Contact Information
                                                </CText>
                                                <CText className="mb-4 text-sm leading-6">
                                                        If you have any questions about these Terms of Service, please
                                                        contact us at support@calog.app
                                                </CText>
                                        </View>

                                        {/* Back Button */}
                                        <Button title="Back" onPress={() => navigation.goBack()} className="mb-4" />
                                </View>
                        </ScrollView>
                </SafeAreaView>
        );
};
