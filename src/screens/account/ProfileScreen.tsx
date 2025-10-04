import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronRightIcon, User, Camera, PenBoxIcon } from 'lucide-react-native';
import { CText } from '../../components/ui/CText';
import { Button } from '../../components/ui/Button';
import { EditModal } from '../../components/ui/EditModal';
import { BasicInfoView, MeasurementsView, ProfileInfoView, FitnessGoalView } from '../../components/profile';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuthStore } from '../../store';

export const ProfileScreen: React.FC = () => {
        const navigation = useNavigation();
        const { profile, updateProfile } = useUserProfile();
        const { user } = useAuthStore();

        // Use profile from hook, or fallback to user.profile from auth store
        const currentProfile = profile || user?.profile;

        const [editModalVisible, setEditModalVisible] = useState(false);
        const [editModalType, setEditModalType] = useState<
                'fitness_goal' | 'measurements' | 'basic_info' | 'profile_info' | null
        >(null);
        const [formValues, setFormValues] = useState<Record<string, any>>({});

        const calculateBMI = (weight: number, height: number) => {
                const heightInMeters = height / 100;
                return (weight / (heightInMeters * heightInMeters)).toFixed(1);
        };

        const getBMIStatus = (bmi: number) => {
                if (bmi < 18.5) return 'Underweight';
                if (bmi < 25) return 'Normal weight';
                if (bmi < 30) return 'Overweight';
                return 'Obesity';
        };

        const getActivityLevelText = (level: string) => {
                const levels = {
                        sedentary: 'Sedentary',
                        light: 'Light Activity',
                        moderate: 'Moderate Activity',
                        active: 'Active',
                        very_active: 'Very Active',
                };
                return levels[level as keyof typeof levels] || level;
        };

        const getGoalText = (goal: string, targetWeight?: number) => {
                if (goal === 'maintain') return 'Maintain current weight';
                if (goal === 'lose' && targetWeight) return `Reduce to ${targetWeight} kg`;
                if (goal === 'gain' && targetWeight) return `Increase to ${targetWeight} kg`;
                return goal;
        };

        const calculateTDEE = (weight: number, height: number, age: number, gender: string, activityLevel: string) => {
                // BMR calculation using Mifflin-St Jeor Equation
                let bmr;
                if (gender === 'male') {
                        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
                } else {
                        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
                }

                // Activity multipliers
                const multipliers = {
                        sedentary: 1.2,
                        light: 1.375,
                        moderate: 1.55,
                        active: 1.725,
                        very_active: 1.9,
                };

                const tdee = bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
                return { bmr: Math.round(bmr), tdee: Math.round(tdee) };
        };

        const handleEditFitnessGoal = () => {
                setEditModalType('fitness_goal');
                setFormValues({
                        activityLevel: currentProfile?.activityLevel || 'moderate',
                        goal: currentProfile?.goal || 'maintain',
                        targetWeight: currentProfile?.targetWeight || 70,
                        weightChangeRate: currentProfile?.weightChangeRate || 0.5,
                });
                setEditModalVisible(true);
        };

        const handleEditBasicInfo = () => {
                setEditModalType('basic_info');
                setFormValues({
                        gender: currentProfile?.gender || 'male',
                        height: currentProfile?.height || 170,
                        weight: currentProfile?.weight || 70,
                        age: currentProfile?.age || 25,
                });
                setEditModalVisible(true);
        };

        const handleEditMeasurements = () => {
                setEditModalType('measurements');
                setFormValues({
                        neck: currentProfile?.neck || null,
                        waist: currentProfile?.waist || null,
                        hip: currentProfile?.hip || null,
                        bicep: currentProfile?.bicep || null,
                        thigh: currentProfile?.thigh || null,
                });
                setEditModalVisible(true);
        };

        const handleEditProfileInfo = () => {
                setEditModalType('profile_info');
                setFormValues({
                        name: user?.fullName || user?.name || '',
                        email: user?.email || '',
                        avatar: user?.avatar || '',
                });
                setEditModalVisible(true);
        };

        const handleSaveEdit = async () => {
                try {
                        if (editModalType === 'basic_info') {
                                await updateProfile(formValues);
                        } else if (editModalType === 'fitness_goal') {
                                await updateProfile({
                                        activityLevel: formValues.activityLevel,
                                        goal: formValues.goal,
                                        targetWeight: formValues.targetWeight,
                                        weightChangeRate: formValues.weightChangeRate,
                                });
                        } else if (editModalType === 'measurements') {
                                await updateProfile({
                                        neck: formValues.neck,
                                        waist: formValues.waist,
                                        hip: formValues.hip,
                                        bicep: formValues.bicep,
                                        thigh: formValues.thigh,
                                });
                        } else if (editModalType === 'profile_info') {
                                // TODO: Update user profile info (name, email, avatar)
                        }
                        setEditModalVisible(false);
                        setEditModalType(null);
                } catch (error) {
                        console.log('Error saving profile:', error);
                }
        };

        const renderModalContent = () => {
                switch (editModalType) {
                        case 'basic_info':
                                return <BasicInfoView currentProfile={currentProfile} onValuesChange={setFormValues} />;
                        case 'fitness_goal':
                                return <FitnessGoalView formValues={formValues} setFormValues={setFormValues} />;
                        case 'measurements':
                                return <MeasurementsView formValues={formValues} setFormValues={setFormValues} />;
                        case 'profile_info':
                                return <ProfileInfoView formValues={formValues} setFormValues={setFormValues} />;
                        default:
                                return null;
                }
        };

        const getEditModalTitle = () => {
                switch (editModalType) {
                        case 'basic_info':
                                return 'Change Personal Information';
                        case 'fitness_goal':
                                return 'Fitness Goals & Activity';
                        case 'measurements':
                                return 'Change Your Measurements';
                        case 'profile_info':
                                return 'Edit Profile';
                        default:
                                return 'Edit';
                }
        };

        const getEditModalDescription = () => {
                switch (editModalType) {
                        case 'basic_info':
                                return 'Update your personal information';
                        case 'fitness_goal':
                                return 'Set your activity level, weight goals, and target weight';
                        case 'measurements':
                                return 'Enter your body measurements for detailed analysis';
                        case 'profile_info':
                                return 'Update your profile information';
                        default:
                                return '';
                }
        };

        React.useEffect(() => {
                // Profile data is already loaded via useUserProfile hook
        }, []);

        if (!currentProfile) {
                return (
                        <SafeAreaView className="flex-1 bg-primary">
                                <View className="flex-1 items-center justify-center px-6">
                                        <CText className="text-text-muted mb-4">No profile data available</CText>
                                        <CText className="text-text-muted text-center text-sm">
                                                User: {user ? '✅' : '❌'} | Profile: {profile ? '✅' : '❌'} |
                                                User.Profile: {user?.profile ? '✅' : '❌'}
                                        </CText>
                                        {user && (
                                                <CText className="text-text-muted mt-2 text-sm">
                                                        User name: {user.name || user.fullName || 'N/A'}
                                                </CText>
                                        )}
                                </View>
                        </SafeAreaView>
                );
        }

        const bmi = parseFloat(calculateBMI(currentProfile.weight, currentProfile.height));
        const { bmr, tdee } = calculateTDEE(
                currentProfile.weight,
                currentProfile.height,
                currentProfile.age,
                currentProfile.gender,
                currentProfile.activityLevel,
        );
        const dailyCalorieGoal =
                currentProfile.dailyCalorieGoal ||
                (currentProfile.goal === 'lose' ? tdee - 550 : currentProfile.goal === 'gain' ? tdee + 550 : tdee);

        return (
                <SafeAreaView className="bg-background flex-1">
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 py-4">
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <ArrowLeft size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                                <CText size="lg" weight="bold" className="text-text-light">
                                        Profile
                                </CText>
                                <View style={{ width: 24 }} />
                        </View>

                        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
                                {/* Profile Information Section */}
                                <TouchableOpacity
                                        className="bg-surfacePrimary mb-4 rounded-xl p-4"
                                        onPress={handleEditProfileInfo}
                                >
                                        <View className="flex-row items-center">
                                                <View className="mr-4 h-16 w-16 items-center justify-center rounded-full bg-primary">
                                                        {user?.avatar ? (
                                                                <Image
                                                                        source={{ uri: user.avatar }}
                                                                        className="h-16 w-16 rounded-full"
                                                                />
                                                        ) : (
                                                                <User size={32} color="#FFFFFF" />
                                                        )}
                                                </View>
                                                <View className="flex-1">
                                                        <CText size="lg" weight="bold" className="text-text-light mb-1">
                                                                {user?.fullName || user?.name || 'User'}
                                                        </CText>
                                                        <CText className="text-text-muted">
                                                                {user?.email || 'user@example.com'}
                                                        </CText>
                                                </View>
                                                <View className="items-center">
                                                        <PenBoxIcon size={20} color="#4CAF50" />
                                                </View>
                                        </View>
                                </TouchableOpacity>

                                {/* Basic Information Section */}
                                <TouchableOpacity
                                        className="bg-surfacePrimary mb-4 rounded-xl p-4"
                                        onPress={handleEditBasicInfo}
                                >
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Gender</CText>
                                                <CText className="text-text-light capitalize">
                                                        {currentProfile.gender}
                                                </CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Weight</CText>
                                                <CText className="text-text-light">{currentProfile.weight} kg</CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Height</CText>
                                                <CText className="text-text-light">{currentProfile.height} cm</CText>
                                        </View>
                                        <View className="flex-row justify-between">
                                                <CText className="text-text-muted">Age</CText>
                                                <CText className="text-text-light">{currentProfile.age} years</CText>
                                        </View>
                                </TouchableOpacity>

                                {/* Body Measurements Section */}
                                <TouchableOpacity
                                        className="bg-surfacePrimary mb-4 rounded-xl p-4"
                                        onPress={handleEditMeasurements}
                                >
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Neck</CText>
                                                <CText className="text-text-light">-- cm</CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Waist</CText>
                                                <CText className="text-text-light">-- cm</CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Hip</CText>
                                                <CText className="text-text-light">-- cm</CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Bicep</CText>
                                                <CText className="text-text-light">-- cm</CText>
                                        </View>
                                        <View className="flex-row justify-between">
                                                <CText className="text-text-muted">Thigh</CText>
                                                <CText className="text-text-light">-- cm</CText>
                                        </View>
                                </TouchableOpacity>

                                {/* Fitness Goals Section */}
                                <TouchableOpacity
                                        className="bg-surfacePrimary mb-4 rounded-xl p-4"
                                        onPress={handleEditFitnessGoal}
                                >
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Activity Level</CText>
                                                <CText className="text-text-light">
                                                        {getActivityLevelText(currentProfile.activityLevel)}: {tdee}{' '}
                                                        kcal/day
                                                </CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText className="text-text-muted">Goal</CText>
                                                <CText className="text-text-light">
                                                        {getGoalText(currentProfile.goal, currentProfile.targetWeight)}
                                                </CText>
                                        </View>
                                        {currentProfile.goal === 'lose' && (
                                                <View className="flex-row justify-between">
                                                        <CText className="text-text-muted">Reduction Level</CText>
                                                        <CText className="text-text-light">
                                                                Reduce {currentProfile.weightChangeRate} kg/week
                                                        </CText>
                                                </View>
                                        )}
                                </TouchableOpacity>

                                {/* Required Calorie Intake Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl p-4">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="text-text-muted mb-1">
                                                                Required Calorie Intake (kcal)
                                                        </CText>
                                                        <CText className="text-text-light text-lg font-bold">
                                                                {Math.round(dailyCalorieGoal)}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-text-muted text-sm">
                                                The amount of calories needed to achieve your weight goal.
                                        </CText>
                                </View>

                                {/* TDEE Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl p-4">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="text-text-muted mb-1">
                                                                TDEE Index (kcal)
                                                        </CText>
                                                        <CText className="text-text-light text-lg font-bold">
                                                                {tdee}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-text-muted text-sm">
                                                The amount of calories consumed in a day to maintain your current
                                                weight.
                                        </CText>
                                </View>

                                {/* BMR Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl p-4">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="text-text-muted mb-1">BMR Index (kcal)</CText>
                                                        <CText className="text-text-light text-lg font-bold">
                                                                {bmr}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-text-muted text-sm">
                                                Minimum energy level your body needs at rest.
                                        </CText>
                                </View>

                                {/* BMI Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl p-4">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="text-text-muted mb-1">BMI Index</CText>
                                                        <CText className="text-text-light text-lg font-bold">
                                                                {bmi}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-text-muted text-sm">
                                                Weight status: {getBMIStatus(bmi)}
                                        </CText>
                                </View>

                                {/* Body Fat Percentage Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl p-4">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="text-text-muted mb-1">
                                                                Body Fat Percentage (%)
                                                        </CText>
                                                        <CText className="text-text-light text-lg font-bold">--</CText>
                                                </View>
                                        </View>
                                        <CText className="text-text-muted text-sm">
                                                To view this index, you need to fill in neck, waist, hip measurements.
                                        </CText>
                                </View>

                                {/* Body Fat Mass Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl p-4">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="text-text-muted mb-1">
                                                                Body Fat Mass (kg)
                                                        </CText>
                                                        <CText className="text-text-light text-lg font-bold">--</CText>
                                                </View>
                                        </View>
                                        <CText className="text-text-muted text-sm">
                                                To view this index, you need to fill in neck, waist, hip measurements.
                                        </CText>
                                </View>

                                {/* FFMI Section */}
                                <View className="bg-surfacePrimary mb-4 rounded-xl p-4">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="text-text-muted mb-1">
                                                                FFMI Index (m2/kg)
                                                        </CText>
                                                        <CText className="text-text-light text-lg font-bold">--</CText>
                                                </View>
                                        </View>
                                        <CText className="text-text-muted text-sm">
                                                To view this index, you need to fill in neck, waist, hip measurements.
                                        </CText>
                                </View>

                                {/* Lean Body Mass Section */}
                                <View className="bg-surfacePrimary mb-6 rounded-xl p-4">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="text-text-muted mb-1">
                                                                Lean Body Mass (kg)
                                                        </CText>
                                                        <CText className="text-text-light text-lg font-bold">--</CText>
                                                </View>
                                        </View>
                                        <CText className="text-text-muted text-sm">
                                                To view this index, you need to fill in neck, waist, hip measurements.
                                        </CText>
                                </View>
                        </ScrollView>

                        {/* Edit Modal */}
                        <EditModal
                                visible={editModalVisible}
                                title={getEditModalTitle()}
                                description={getEditModalDescription()}
                                onClose={() => {
                                        setEditModalVisible(false);
                                        setEditModalType(null);
                                }}
                                onSave={handleSaveEdit}
                        >
                                {renderModalContent()}
                        </EditModal>
                </SafeAreaView>
        );
};
