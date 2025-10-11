import React, { useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';
import { UserProfile } from '../../types';
import { profileApi } from '../../services/api/profileApi';
import { onboardingStorage } from '../../services/onboardingStorage';
import Toast from 'react-native-toast-message';

import { WelcomeSlide } from './WelcomeSlide';
import { ValuePropositionSlide } from './ValuePropositionSlide';
import { BasicProfileSlide } from './BasicProfileSlide';
import { GoalSettingSlide } from './GoalSettingSlide';

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

        // All slides definition
        const slides = [
                { key: 'welcome', component: WelcomeSlide },
                { key: 'value-proposition', component: ValuePropositionSlide },
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

        // Render each slide dynamically
        const renderSlide = ({ item }: { item: any }) => {
                const SlideComponent = item.component;
                return (
                        <SlideComponent
                                onDataChange={item.onDataChange}
                                onValidationChange={item.onValidationChange}
                                profileData={profileData}
                        />
                );
        };

        // Handle final submit when "Finish" is pressed
        const handleDone = async () => {
                // Check required fields
                const hasRequiredFields =
                        profileData.gender &&
                        profileData.age &&
                        profileData.height &&
                        profileData.weight &&
                        profileData.activityLevel &&
                        profileData.goal;

                // For lose/gain goals, also check if target weight and rate are provided
                const hasWeightGoalFields =
                        profileData.goal === 'maintain' || (profileData.targetWeight && profileData.weightChangeRate);

                if (hasRequiredFields && hasWeightGoalFields) {
                        try {
                                // Calculate calorie goal
                                const calorieResponse = await profileApi.calculateCalorieGoal(
                                        profileData as UserProfile,
                                );

                                const completeProfile = {
                                        ...profileData,
                                        dailyCalorieGoal: calorieResponse.dailyCalorieGoal,
                                } as UserProfile;

                                // Save profile to local storage first
                                await onboardingStorage.saveUserProfile(completeProfile);
                                await onboardingStorage.setOnboardingCompleted();

                                // Now sync to database since user is authenticated
                                try {
                                        await profileApi.updateProfile(completeProfile);

                                        Toast.show({
                                                type: 'success',
                                                text1: 'Profile Setup Complete!',
                                                text2: 'Welcome to Calog! 🎉',
                                                position: 'top',
                                        });
                                } catch (error) {
                                        Toast.show({
                                                type: 'info',
                                                text1: 'Profile Saved Locally',
                                                text2: 'Will sync when connection improves',
                                                position: 'top',
                                        });
                                }

                                onComplete(completeProfile);
                        } catch (error) {
                                // Show detailed error message
                                Toast.show({
                                        type: 'error',
                                        text1: 'Setup Error',
                                        text2: 'Something went wrong. Please try again.',
                                        position: 'top',
                                });

                                // Save locally - will sync when user signs up
                                Toast.show({
                                        type: 'info',
                                        text1: 'Profile Saved Locally',
                                        text2: 'Will sync when you sign up',
                                        position: 'top',
                                });

                                // Save profile to local storage even if there's an error
                                await onboardingStorage.saveUserProfile(profileData as UserProfile);
                                await onboardingStorage.setOnboardingCompleted();

                                onComplete(profileData as UserProfile);
                        }
                } else {
                        Toast.show({
                                type: 'error',
                                text1: 'Incomplete Profile',
                                text2: 'Please fill in all required fields',
                                position: 'top',
                        });
                }
        };

        // Go to the next slide (only if valid)
        const handleNext = () => {
                if (currentSlideIndex === 2 && !isBasicProfileValid) {
                        return; // Prevent going next if basic profile form is invalid
                }
                const nextIndex = currentSlideIndex + 1;
                setCurrentSlideIndex(nextIndex);
                sliderRef.current?.goToSlide(nextIndex);
        };

        // Go to the previous slide
        const handlePrev = () => {
                if (currentSlideIndex === 0) return; // Do nothing on the first slide
                const prevIndex = currentSlideIndex - 1;
                setCurrentSlideIndex(prevIndex);
                sliderRef.current?.goToSlide(prevIndex);
        };

        try {
                return (
                        <SafeAreaView className="flex-1 bg-background">
                                <AppIntroSlider
                                        ref={sliderRef}
                                        renderItem={renderSlide}
                                        data={slides}
                                        onSlideChange={(index) => setCurrentSlideIndex(index)}
                                        scrollEnabled={false}
                                        showNextButton={false}
                                        showPrevButton={false}
                                        showDoneButton={false}
                                        showSkipButton={false}
                                        renderPagination={() => {
                                                const isNextDisabled = currentSlideIndex === 2 && !isBasicProfileValid;
                                                const isPrevDisabled = currentSlideIndex === 0;
                                                const isDoneDisabled = currentSlideIndex === 3 && !isGoalValid;

                                                return (
                                                        <View
                                                                style={{
                                                                        flexDirection: 'row',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        paddingHorizontal: 16,
                                                                        paddingVertical: 12,
                                                                }}
                                                        >
                                                                {/* Back button */}
                                                                <Button
                                                                        title="Back"
                                                                        onPress={handlePrev}
                                                                        disabled={isPrevDisabled}
                                                                        variant="ghost"
                                                                        size="small"
                                                                        className="min-w-[80px]"
                                                                />

                                                                {/* Dots in the middle */}
                                                                <View
                                                                        style={{
                                                                                flexDirection: 'row',
                                                                                alignItems: 'center',
                                                                        }}
                                                                >
                                                                        {slides.map((_, i) => (
                                                                                <View
                                                                                        key={i}
                                                                                        style={{
                                                                                                width: 8,
                                                                                                height: 8,
                                                                                                borderRadius: 4,
                                                                                                marginHorizontal: 4,
                                                                                                backgroundColor:
                                                                                                        i ===
                                                                                                        currentSlideIndex
                                                                                                                ? '#4CAF50' // active dot
                                                                                                                : 'rgba(255,255,255,0.3)', // inactive dot
                                                                                        }}
                                                                                />
                                                                        ))}
                                                                </View>

                                                                {/* Next or Finish button */}
                                                                {currentSlideIndex === slides.length - 1 ? (
                                                                        <Button
                                                                                title="Finish"
                                                                                onPress={handleDone}
                                                                                disabled={isDoneDisabled}
                                                                                size="small"
                                                                                className="min-w-[80px]"
                                                                        />
                                                                ) : (
                                                                        <Button
                                                                                title="Next"
                                                                                onPress={handleNext}
                                                                                disabled={isNextDisabled}
                                                                                size="small"
                                                                                className="min-w-[80px]"
                                                                        />
                                                                )}
                                                        </View>
                                                );
                                        }}
                                />
                        </SafeAreaView>
                );
        } catch (error) {
                // Show error toast
                Toast.show({
                        type: 'error',
                        text1: 'App Error',
                        text2: 'Something went wrong. Please restart the app.',
                        position: 'top',
                });

                // Return fallback UI
                return (
                        <SafeAreaView className="flex-1 items-center justify-center bg-background">
                                <CText className="text-center text-white">
                                        Something went wrong.{'\n'}Please restart the app.
                                </CText>
                        </SafeAreaView>
                );
        }
};
