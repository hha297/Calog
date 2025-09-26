import React, { useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

import { BasicProfileSlide } from './BasicProfileSlide';
import { GoalSettingSlide } from './GoalSettingSlide';
import { UserProfile } from '../../types';
import { profileApi } from '../../services/api/profileApi';
import Toast from 'react-native-toast-message';
import { WelcomeSlide } from './WelcomeSlide';
import { ValuePropositionSlide } from './ValuePropositionSlide';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
        onComplete: (profile: UserProfile) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
        const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
        const [isBasicProfileValid, setIsBasicProfileValid] = useState(false);
        const [isGoalValid, setIsGoalValid] = useState(false);
        const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
        const sliderRef = useRef<AppIntroSlider>(null);

        const slides = [
                {
                        key: 'welcome',
                        component: WelcomeSlide,
                },
                {
                        key: 'value-proposition',
                        component: ValuePropositionSlide,
                },
                {
                        key: 'basic-profile',
                        component: BasicProfileSlide,
                        onDataChange: (data: Partial<UserProfile>) => {
                                setProfileData((prev) => ({ ...prev, ...data }));
                        },
                        onValidationChange: setIsBasicProfileValid,
                },
                {
                        key: 'goal-setting',
                        component: GoalSettingSlide,
                        onDataChange: (data: Partial<UserProfile>) => {
                                setProfileData((prev) => ({ ...prev, ...data }));
                        },
                        onValidationChange: setIsGoalValid,
                },
        ];

        const renderSlide = ({ item }: { item: any }) => {
                const SlideComponent = item.component;
                return (
                        <SlideComponent
                                onNext={item.onNext}
                                onDataChange={item.onDataChange}
                                onValidationChange={item.onValidationChange}
                                profileData={profileData}
                        />
                );
        };

        const handleDone = async () => {
                if (
                        profileData.gender &&
                        profileData.age &&
                        profileData.height &&
                        profileData.weight &&
                        profileData.activityLevel &&
                        profileData.goal
                ) {
                        try {
                                // Calculate daily calorie goal
                                const calorieResponse = await profileApi.calculateCalorieGoal(
                                        profileData as UserProfile,
                                );
                                const completeProfile = {
                                        ...profileData,
                                        dailyCalorieGoal: calorieResponse.dailyCalorieGoal,
                                } as UserProfile;

                                // Update profile on server
                                await profileApi.updateProfile(completeProfile);

                                // Show success message
                                Toast.show({
                                        type: 'success',
                                        text1: 'Profile Setup Complete!',
                                        text2: 'Welcome to Calog! 🎉',
                                        position: 'top',
                                });

                                onComplete(completeProfile);
                        } catch (error) {
                                console.error('Error completing onboarding:', error);

                                // Still complete onboarding even if server sync fails
                                Toast.show({
                                        type: 'warning',
                                        text1: 'Profile Saved Locally',
                                        text2: 'Will sync when connection improves',
                                        position: 'top',
                                });

                                onComplete(profileData as UserProfile);
                        }
                }
        };

        const handleSkip = () => {
                // Allow skipping onboarding with default values
                const defaultProfile: UserProfile = {
                        gender: 'other',
                        age: 25,
                        height: 170,
                        weight: 70,
                        activityLevel: 'moderate',
                        goal: 'maintain',
                };
                onComplete(defaultProfile);
        };

        const handleNext = () => {
                // Check validation before allowing next
                if (currentSlideIndex === 2 && !isBasicProfileValid) {
                        return; // Don't proceed if basic profile is invalid
                }
                sliderRef.current?.goToSlide(currentSlideIndex + 1);
        };

        const handlePrev = () => {
                sliderRef.current?.goToSlide(currentSlideIndex - 1);
        };

        return (
                <SafeAreaView className="flex-1 bg-primary">
                        <AppIntroSlider
                                ref={sliderRef}
                                renderItem={renderSlide}
                                data={slides}
                                onDone={handleDone}
                                onSkip={handleSkip}
                                onSlideChange={(index) => setCurrentSlideIndex(index)}
                                showSkipButton={false}
                                showDoneButton={true}
                                showPrevButton={true}
                                showNextButton={true}
                                dotStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        width: 8,
                                        height: 8,
                                }}
                                activeDotStyle={{
                                        backgroundColor: '#10B981', // tertiary color
                                        width: 8,
                                        height: 8,
                                }}
                                doneLabel="Finish"
                                nextLabel="Next"
                                prevLabel="Back"
                                renderDoneButton={() => {
                                        // Only disable Finish button on goal-setting slide (index 3)
                                        const shouldDisable = currentSlideIndex === 3 && !isGoalValid;
                                        return (
                                                <View className="px-4 py-2">
                                                        <CText
                                                                className={`font-semibold ${shouldDisable ? 'text-text-muted' : 'text-tertiary'}`}
                                                        >
                                                                Finish
                                                        </CText>
                                                </View>
                                        );
                                }}
                                renderNextButton={() => {
                                        // Only disable Next button on basic-profile slide (index 2)
                                        const shouldDisable = currentSlideIndex === 2 && !isBasicProfileValid;
                                        return (
                                                <View className="px-4 py-2">
                                                        <CText
                                                                className={`font-semibold ${shouldDisable ? 'text-text-muted' : 'text-tertiary'}`}
                                                        >
                                                                Next
                                                        </CText>
                                                </View>
                                        );
                                }}
                                renderPrevButton={() => (
                                        <View className="px-4 py-2">
                                                <CText className="text-text-muted">Back</CText>
                                        </View>
                                )}
                        />
                </SafeAreaView>
        );
};
