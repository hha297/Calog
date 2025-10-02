import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronRightIcon } from 'lucide-react-native';
import { CText } from '../components/ui/CText';
import { Button } from '../components/ui/Button';
import { EditModal, EditModalField } from '../components/ui/EditModal';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthStore } from '../store';

// TODO: Fix UI for Personal Profile Update, add cancel modal when press outside modal
// TODO: Finalize the UI for the modal

export const PhysicalProfileScreen: React.FC = () => {
        const navigation = useNavigation();
        const { profile, updateProfile } = useUserProfile();
        const { user } = useAuthStore();

        // Use profile from hook, or fallback to user.profile from auth store
        const currentProfile = profile || user?.profile;

        const [editModalVisible, setEditModalVisible] = useState(false);
        const [editModalType, setEditModalType] = useState<
                'weight_goal' | 'activity_level' | 'measurements' | 'basic_info' | null
        >(null);

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

        const handleEditWeightGoal = () => {
                setEditModalType('weight_goal');
                setEditModalVisible(true);
        };

        const handleEditActivityLevel = () => {
                setEditModalType('activity_level');
                setEditModalVisible(true);
        };

        const handleEditBasicInfo = () => {
                setEditModalType('basic_info');
                setEditModalVisible(true);
        };

        const handleEditMeasurements = () => {
                setEditModalType('measurements');
                setEditModalVisible(true);
        };

        const handleSaveEdit = async (values: Record<string, any>) => {
                try {
                        if (editModalType === 'weight_goal') {
                                await updateProfile({
                                        goal: values.goal,
                                        targetWeight: values.targetWeight,
                                        weightChangeRate: values.weightChangeRate,
                                });
                        } else if (editModalType === 'activity_level') {
                                await updateProfile({
                                        activityLevel: values.activityLevel,
                                });
                        } else if (editModalType === 'basic_info') {
                                await updateProfile({
                                        gender: values.gender,
                                        weight: values.weight,
                                        height: values.height,
                                        age: values.age,
                                });
                        } else if (editModalType === 'measurements') {
                                // TODO: Update body measurements
                                console.log('Update measurements:', values);
                        }
                        setEditModalVisible(false);
                        setEditModalType(null);
                } catch (error) {
                        console.log('Error saving profile:', error);
                }
        };

        const getEditModalFields = (): EditModalField[] => {
                if (!currentProfile) return [];

                switch (editModalType) {
                        case 'basic_info':
                                return [
                                        {
                                                key: 'gender',
                                                label: 'Gender',
                                                type: 'gender_buttons',
                                                value: currentProfile.gender,
                                                options: [
                                                        { label: 'Male', value: 'male' },
                                                        { label: 'Female', value: 'female' },
                                                ],
                                        },
                                        {
                                                key: 'height',
                                                label: 'Height (cm)',
                                                type: 'slider',
                                                value: currentProfile.height,
                                                unit: 'cm',
                                                min: 100,
                                                max: 250,
                                                step: 1,
                                        },
                                        {
                                                key: 'weight_age',
                                                label: 'Weight & Age',
                                                type: 'dual_stepper',
                                                value: '',
                                                fields: [
                                                        {
                                                                key: 'weight',
                                                                label: 'Weight (kg)',
                                                                unit: 'kg',
                                                                min: 30,
                                                                max: 200,
                                                                step: 1,
                                                        },
                                                        {
                                                                key: 'age',
                                                                label: 'Age',
                                                                unit: 'years',
                                                                min: 10,
                                                                max: 100,
                                                                step: 1,
                                                        },
                                                ],
                                        },
                                ];

                        case 'weight_goal':
                                return [
                                        {
                                                key: 'goal',
                                                label: 'Goal',
                                                type: 'select',
                                                value: currentProfile.goal,
                                                options: [
                                                        { label: 'Maintain Weight', value: 'maintain' },
                                                        { label: 'Lose Weight', value: 'lose' },
                                                        { label: 'Gain Weight', value: 'gain' },
                                                ],
                                        },
                                        {
                                                key: 'targetWeight',
                                                label: 'Target Weight',
                                                type: 'number',
                                                value: currentProfile.targetWeight || 0,
                                                unit: 'kg',
                                                min: 30,
                                                max: 200,
                                        },
                                        {
                                                key: 'weightChangeRate',
                                                label: 'Weight Change Rate',
                                                type: 'select',
                                                value: currentProfile.weightChangeRate || 0.5,
                                                options: [
                                                        { label: 'Slow (0.25 kg/week)', value: 0.25 },
                                                        { label: 'Moderate (0.5 kg/week)', value: 0.5 },
                                                        { label: 'Fast (0.75 kg/week)', value: 0.75 },
                                                        { label: 'Very Fast (1 kg/week)', value: 1.0 },
                                                ],
                                        },
                                ];

                        case 'activity_level':
                                return [
                                        {
                                                key: 'activityLevel',
                                                label: 'Activity Level',
                                                type: 'select',
                                                value: currentProfile.activityLevel,
                                                options: [
                                                        { label: 'Sedentary (little/no exercise)', value: 'sedentary' },
                                                        {
                                                                label: 'Light (light exercise 1-3 days/week)',
                                                                value: 'light',
                                                        },
                                                        {
                                                                label: 'Moderate (moderate exercise 3-5 days/week)',
                                                                value: 'moderate',
                                                        },
                                                        {
                                                                label: 'Active (heavy exercise 6-7 days/week)',
                                                                value: 'active',
                                                        },
                                                        {
                                                                label: 'Very Active (very heavy exercise, physical job)',
                                                                value: 'very_active',
                                                        },
                                                ],
                                        },
                                ];

                        case 'measurements':
                                return [
                                        {
                                                key: 'neck',
                                                label: 'Neck',
                                                type: 'number',
                                                value: 0,
                                                unit: 'cm',
                                                min: 20,
                                                max: 50,
                                        },
                                        {
                                                key: 'waist',
                                                label: 'Waist',
                                                type: 'number',
                                                value: 0,
                                                unit: 'cm',
                                                min: 50,
                                                max: 150,
                                        },
                                        {
                                                key: 'hip',
                                                label: 'Hip',
                                                type: 'number',
                                                value: 0,
                                                unit: 'cm',
                                                min: 70,
                                                max: 150,
                                        },
                                        {
                                                key: 'bicep',
                                                label: 'Bicep',
                                                type: 'number',
                                                value: 0,
                                                unit: 'cm',
                                                min: 15,
                                                max: 50,
                                        },
                                        {
                                                key: 'thigh',
                                                label: 'Thigh',
                                                type: 'number',
                                                value: 0,
                                                unit: 'cm',
                                                min: 30,
                                                max: 80,
                                        },
                                ];

                        default:
                                return [];
                }
        };

        const getEditModalTitle = () => {
                switch (editModalType) {
                        case 'basic_info':
                                return 'Change Personal Information';
                        case 'weight_goal':
                                return 'Change Weight Goal';
                        case 'activity_level':
                                return 'Change Activity Level';
                        case 'measurements':
                                return 'Change Your Measurements';
                        default:
                                return 'Edit';
                }
        };

        const getEditModalDescription = () => {
                switch (editModalType) {
                        case 'basic_info':
                                return 'Update your personal information';
                        case 'weight_goal':
                                return 'Set your weight goal and target weight';
                        case 'activity_level':
                                return 'Select your activity level for accurate calorie calculations';
                        case 'measurements':
                                return 'Enter your body measurements for detailed analysis';
                        default:
                                return '';
                }
        };

        React.useEffect(() => {
                // Profile data is already loaded via useUserProfile hook
                console.log('PhysicalProfileScreen mounted');
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
                <SafeAreaView className="flex-1 bg-primary">
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 py-4">
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <ArrowLeft size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                                <CText size="lg" weight="bold" className="text-text-light">
                                        Physical Profile
                                </CText>
                                <View style={{ width: 24 }} />
                        </View>

                        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
                                {/* Basic Information Section */}
                                <TouchableOpacity
                                        className="mb-4 rounded-xl bg-white/5 p-4"
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
                                        className="mb-4 rounded-xl bg-white/5 p-4"
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

                                {/* Activity Level Section */}
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
                                        <TouchableOpacity
                                                className="flex-row items-center justify-between"
                                                onPress={handleEditActivityLevel}
                                        >
                                                <View className="flex-row items-center">
                                                        <CText className="text-text-muted mr-2">Activity Level</CText>
                                                        <ChevronRightIcon size={16} color="#9CA3AF" />
                                                </View>
                                                <CText className="text-text-light">
                                                        {getActivityLevelText(currentProfile.activityLevel)}: {tdee}{' '}
                                                        kcal/day
                                                </CText>
                                        </TouchableOpacity>
                                </View>

                                {/* Goal Section */}
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
                                        <TouchableOpacity
                                                className="flex-row items-center justify-between"
                                                onPress={handleEditWeightGoal}
                                        >
                                                <View className="flex-row items-center">
                                                        <CText className="text-text-muted mr-2">Goal</CText>
                                                        <ChevronRightIcon size={16} color="#9CA3AF" />
                                                </View>
                                                <CText className="text-text-light">
                                                        {getGoalText(currentProfile.goal, currentProfile.targetWeight)}
                                                </CText>
                                        </TouchableOpacity>
                                </View>

                                {/* Reduction Level Section */}
                                {currentProfile.goal === 'lose' && (
                                        <View className="mb-4 rounded-xl bg-white/5 p-4">
                                                <TouchableOpacity
                                                        className="flex-row items-center justify-between"
                                                        onPress={handleEditWeightGoal}
                                                >
                                                        <View className="flex-row items-center">
                                                                <CText className="text-text-muted mr-2">
                                                                        Reduction Level
                                                                </CText>
                                                                <ChevronRightIcon size={16} color="#9CA3AF" />
                                                        </View>
                                                        <CText className="text-text-light">
                                                                Reduce {currentProfile.weightChangeRate} kg/week
                                                        </CText>
                                                </TouchableOpacity>
                                        </View>
                                )}

                                {/* Required Calorie Intake Section */}
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
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
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
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
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
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
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
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
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
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
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
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
                                <View className="mb-4 rounded-xl bg-white/5 p-4">
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
                                <View className="mb-6 rounded-xl bg-white/5 p-4">
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
                                fields={getEditModalFields()}
                                onClose={() => {
                                        setEditModalVisible(false);
                                        setEditModalType(null);
                                }}
                                onSave={handleSaveEdit}
                        />
                </SafeAreaView>
        );
};
