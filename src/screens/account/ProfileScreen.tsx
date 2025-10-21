import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, User, PenBoxIcon, AlertTriangleIcon } from 'lucide-react-native';
import { CText } from '../../components/ui/CText';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Button } from '../../components/ui/Button';
import { EditModal } from '../../components/ui/EditModal';
import { measurementLogStorage, MeasurementLogEntry } from '../../services/measurementLogStorage';
import { BasicInfoView, MeasurementsView, ProfileInfoView, FitnessGoalView } from '../../components/profile';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuthStore } from '../../store';
import { calculateBodyComposition, calculateTDEE, calculateBMI, getBMIStatus } from '../../utils/helpers';
import { useTheme } from '../../contexts';
import { MeasurementLogModal } from '../../components/MeasurementLogModal';

export const ProfileScreen: React.FC = () => {
        const navigation = useNavigation();
        const { profile, updateProfile, loadProfile, setProfile } = useUserProfile();
        const { user } = useAuthStore();
        const currentProfile = profile || user?.profile;

        const [editModalVisible, setEditModalVisible] = useState(false);
        const [editModalType, setEditModalType] = useState<
                'fitness_goal' | 'measurements' | 'basic_info' | 'profile_info' | null
        >(null);
        const [formValues, setFormValues] = useState<Record<string, any>>({});
        const [initialValues, setInitialValues] = useState<Record<string, any>>({});
        const [logModalVisible, setLogModalVisible] = useState(false);
        const [logs, setLogs] = useState<MeasurementLogEntry[]>([]);
        const [confirmVisible, setConfirmVisible] = useState(false);
        const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

        // Handlers
        const handleReviewMeasurementLog = async () => {
                const data = await measurementLogStorage.getLogs();
                const sortedLogs = data.sort(
                        (a: any, b: any) =>
                                new Date(b.createdAt || b.recordedAt).getTime() -
                                new Date(a.createdAt || a.recordedAt).getTime(),
                );
                setLogs(sortedLogs as any);
                setLogModalVisible(true);
        };

        const handleDeleteMeasurementLog = async (logIndex: number) => {
                setPendingDeleteIndex(logIndex);
                setConfirmVisible(true);
        };

        const confirmDelete = async () => {
                if (pendingDeleteIndex === null) return;
                try {
                        await measurementLogStorage.deleteLog(pendingDeleteIndex);
                        await loadProfile();
                        setProfile(null);
                        setTimeout(async () => {
                                await loadProfile();
                        }, 100);
                        setFormValues({ neck: null, waist: null, hip: null, bicep: null, thigh: null });
                        const data = await measurementLogStorage.getLogs();
                        const sortedLogs = data.sort(
                                (a: any, b: any) =>
                                        new Date(b.createdAt || b.recordedAt).getTime() -
                                        new Date(a.createdAt || a.recordedAt).getTime(),
                        );
                        setLogs(sortedLogs as any);
                        setConfirmVisible(false);
                        setPendingDeleteIndex(null);
                } catch (error) {
                        console.error('Failed to delete measurement log:', error);
                }
        };

        const isSaveDisabled = useMemo(() => {
                if (!editModalType) return true;
                const keysByType: Record<string, string[]> = {
                        basic_info: ['gender', 'height', 'weight', 'age'],
                        fitness_goal: ['activityLevel', 'goal', 'targetWeight', 'weightChangeRate'],
                        measurements: ['neck', 'waist', 'hip', 'bicep', 'thigh'],
                        profile_info: ['name', 'email', 'avatar'],
                };
                const keys = keysByType[editModalType] || [];
                return keys.every((k) => initialValues[k] === formValues[k]);
        }, [editModalType, formValues, initialValues]);

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

        // Calculate body composition metrics
        const bodyComposition = currentProfile
                ? calculateBodyComposition(
                          currentProfile.weight,
                          currentProfile.height,
                          currentProfile.age,
                          currentProfile.gender,
                          currentProfile.neck,
                          currentProfile.waist,
                          currentProfile.hip,
                  )
                : null;

        const handleEditFitnessGoal = () => {
                setEditModalType('fitness_goal');
                setFormValues({
                        activityLevel: currentProfile?.activityLevel || 'moderate',
                        goal: currentProfile?.goal || 'maintain',
                        targetWeight: currentProfile?.targetWeight || 70,
                        weightChangeRate: currentProfile?.weightChangeRate || 0.5,
                });
                setInitialValues({
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
                setInitialValues({
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
                setInitialValues({
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
                setInitialValues({
                        name: user?.fullName || user?.name || '',
                        email: user?.email || '',
                        avatar: user?.avatar || '',
                });
                setEditModalVisible(true);
        };

        const handleAvatarUploaded = async (avatarUrl: string) => {
                // Update the user state with new avatar
                const { setUser } = useAuthStore.getState();
                if (user) {
                        setUser({
                                ...user,
                                avatar: avatarUrl,
                        });
                }

                // Reload profile to get fresh data
                await loadProfile();
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
                                // Append measurement log
                                const measurements = {
                                        neck: formValues.neck
                                                ? { value: formValues.neck, unit: 'cm' as const }
                                                : undefined,
                                        waist: formValues.waist
                                                ? { value: formValues.waist, unit: 'cm' as const }
                                                : undefined,
                                        hip: formValues.hip
                                                ? { value: formValues.hip, unit: 'cm' as const }
                                                : undefined,
                                        bicep: formValues.bicep
                                                ? { value: formValues.bicep, unit: 'cm' as const }
                                                : undefined,
                                        thigh: formValues.thigh
                                                ? { value: formValues.thigh, unit: 'cm' as const }
                                                : undefined,
                                };

                                // Remove undefined values
                                const filteredMeasurements = Object.fromEntries(
                                        Object.entries(measurements).filter(([_, value]) => value !== undefined),
                                );

                                if (Object.keys(filteredMeasurements).length > 0) {
                                        await measurementLogStorage.appendLogs(filteredMeasurements);
                                }
                        } else if (editModalType === 'profile_info') {
                                // TODO: Update user profile info (name, email, avatar)
                        }

                        // Reload profile data to ensure UI shows latest data
                        await loadProfile();

                        setEditModalVisible(false);
                        setEditModalType(null);
                } catch (error) {
                        console.error('Error saving profile:', error);
                }
        };

        const renderModalContent = () => {
                switch (editModalType) {
                        case 'basic_info':
                                return <BasicInfoView currentProfile={currentProfile} onValuesChange={setFormValues} />;
                        case 'fitness_goal':
                                return <FitnessGoalView formValues={formValues} setFormValues={setFormValues} />;
                        case 'measurements':
                                return (
                                        <MeasurementsView
                                                formValues={formValues}
                                                setFormValues={setFormValues}
                                                onReviewLog={handleReviewMeasurementLog}
                                        />
                                );
                        case 'profile_info':
                                return (
                                        <ProfileInfoView
                                                formValues={formValues}
                                                setFormValues={setFormValues}
                                                onAvatarUploaded={handleAvatarUploaded}
                                        />
                                );
                        default:
                                return null;
                }
        };

        const getEditModalTitle = () => {
                const titles = {
                        basic_info: 'Change Personal Information',
                        fitness_goal: 'Fitness Goals & Activity',
                        measurements: 'Change Your Measurements',
                        profile_info: 'Edit Profile',
                };
                return titles[editModalType as keyof typeof titles] || 'Edit';
        };

        const getEditModalDescription = () => {
                const descriptions = {
                        basic_info: 'Update your personal information',
                        fitness_goal: 'Set your activity level, weight goals, and target weight',
                        measurements: 'Enter your body measurements for detailed analysis',
                        profile_info: 'Update your profile information',
                };
                return descriptions[editModalType as keyof typeof descriptions] || '';
        };

        React.useEffect(() => {
                // Profile data is already loaded via useUserProfile hook
        }, []);

        if (!currentProfile) {
                return (
                        <SafeAreaView className="flex-1 bg-primary">
                                <View className="flex-1 items-center justify-center px-6">
                                        <CText className="mb-4">No profile data available</CText>
                                        <CText className="text-center text-sm">
                                                User: {user ? '✅' : '❌'} | Profile: {profile ? '✅' : '❌'} |
                                                User.Profile: {user?.profile ? '✅' : '❌'}
                                        </CText>
                                        {user && (
                                                <CText className="mt-2 text-sm">
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
        const { isDark } = useTheme();

        return (
                <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 py-6">
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                                </TouchableOpacity>
                                <CText size="2xl" weight="bold">
                                        Profile
                                </CText>
                                <View style={{ width: 24 }} />
                        </View>

                        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
                                {/* Profile Information Section */}
                                <TouchableOpacity
                                        className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark"
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
                                                        <CText size="lg" weight="bold" className="mb-1">
                                                                {user?.fullName || user?.name || 'User'}
                                                        </CText>
                                                        <CText>{user?.email || 'user@example.com'}</CText>
                                                </View>
                                                <View className="items-center">
                                                        <PenBoxIcon size={20} color="#4CAF50" />
                                                </View>
                                        </View>
                                </TouchableOpacity>

                                {/* Basic Information Section */}
                                <TouchableOpacity
                                        className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark"
                                        onPress={handleEditBasicInfo}
                                >
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Gender</CText>
                                                <CText className="capitalize">{currentProfile.gender}</CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Weight</CText>
                                                <CText>{currentProfile.weight} kg</CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Height</CText>
                                                <CText>{currentProfile.height} cm</CText>
                                        </View>
                                        <View className="flex-row justify-between">
                                                <CText>Age</CText>
                                                <CText>{currentProfile.age} years</CText>
                                        </View>
                                </TouchableOpacity>

                                {/* Body Measurements Section */}
                                <TouchableOpacity
                                        className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark"
                                        onPress={handleEditMeasurements}
                                >
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Neck</CText>
                                                <CText>
                                                        {currentProfile?.neck ? `${currentProfile.neck} cm` : '-- cm'}
                                                </CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Waist</CText>
                                                <CText>
                                                        {currentProfile?.waist ? `${currentProfile.waist} cm` : '-- cm'}
                                                </CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Hip</CText>
                                                <CText>
                                                        {currentProfile?.hip ? `${currentProfile.hip} cm` : '-- cm'}
                                                </CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Bicep</CText>
                                                <CText>
                                                        {currentProfile?.bicep ? `${currentProfile.bicep} cm` : '-- cm'}
                                                </CText>
                                        </View>
                                        <View className="flex-row justify-between">
                                                <CText>Thigh</CText>
                                                <CText>
                                                        {currentProfile?.thigh ? `${currentProfile.thigh} cm` : '-- cm'}
                                                </CText>
                                        </View>
                                </TouchableOpacity>

                                {/* Fitness Goals Section */}
                                <TouchableOpacity
                                        className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark"
                                        onPress={handleEditFitnessGoal}
                                >
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Activity Level</CText>
                                                <CText>{getActivityLevelText(currentProfile.activityLevel)}</CText>
                                        </View>
                                        <View className="mb-2 flex-row justify-between">
                                                <CText>Goal</CText>
                                                <CText>
                                                        {getGoalText(currentProfile.goal, currentProfile.targetWeight)}
                                                </CText>
                                        </View>
                                        {currentProfile.goal === 'lose' && (
                                                <View className="flex-row justify-between">
                                                        <CText>Reduction Level</CText>
                                                        <CText>
                                                                {currentProfile.weightChangeRate} kcal/day deficit
                                                        </CText>
                                                </View>
                                        )}
                                </TouchableOpacity>

                                {/* Required Calorie Intake Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="mb-1">Required Calorie Intake (kcal)</CText>
                                                        <CText className="text-lg" weight="bold">
                                                                {Math.round(dailyCalorieGoal)}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-sm">
                                                The amount of calories needed to achieve your weight goal.
                                        </CText>
                                        {dailyCalorieGoal < bmr && (
                                                <View className="mt-3 rounded-lg border bg-status-error p-3">
                                                        <View className="flex-col items-center justify-center">
                                                                <AlertTriangleIcon size={24} color="#FFFFFF" />

                                                                <CText className="mt-1 text-sm" weight="medium">
                                                                        Eating below BMR may be unsafe and can harm your
                                                                        metabolism. Consider reducing your daily calorie
                                                                        deficit/surplus in Fitness Goals.
                                                                </CText>
                                                        </View>
                                                </View>
                                        )}
                                </View>

                                {/* TDEE Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="mb-1">TDEE Index (kcal)</CText>
                                                        <CText className="text-lg" weight="bold">
                                                                {tdee}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-sm">
                                                The amount of calories consumed in a day to maintain your current
                                                weight.
                                        </CText>
                                </View>

                                {/* BMR Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="mb-1">BMR Index (kcal)</CText>
                                                        <CText className="text-lg" weight="bold">
                                                                {bmr}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-sm">Minimum energy level your body needs at rest.</CText>
                                </View>

                                {/* BMI Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="mb-1">BMI Index</CText>
                                                        <CText className="text-lg" weight="bold">
                                                                {bmi}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-sm">Weight status: {getBMIStatus(bmi)}</CText>
                                </View>

                                {/* Body Fat Percentage Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="mb-1">Body Fat Percentage (%)</CText>
                                                        <CText className="text-lg" weight="bold">
                                                                {bodyComposition
                                                                        ? `${bodyComposition.bodyFatPercentage}%`
                                                                        : '--'}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-sm">
                                                {bodyComposition
                                                        ? 'Calculated using Navy Method'
                                                        : 'To view this index, you need to fill in neck, waist, hip measurements.'}
                                        </CText>
                                </View>

                                {/* Body Fat Mass Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="mb-1">Body Fat Mass (kg)</CText>
                                                        <CText className="text-lg" weight="bold">
                                                                {bodyComposition
                                                                        ? `${bodyComposition.bodyFatMass} kg`
                                                                        : '--'}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-sm">
                                                {bodyComposition
                                                        ? 'Total fat mass in your body'
                                                        : 'To view this index, you need to fill in neck, waist, hip measurements.'}
                                        </CText>
                                </View>

                                {/* FFMI Section */}
                                <View className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="mb-1">FFMI Index (kg/m²)</CText>
                                                        <CText className="text-lg" weight="bold">
                                                                {bodyComposition ? bodyComposition.ffmi : '--'}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-sm">
                                                {bodyComposition
                                                        ? 'Fat-Free Mass Index - muscle mass relative to height'
                                                        : 'To view this index, you need to fill in neck, waist, hip measurements.'}
                                        </CText>
                                </View>

                                {/* Lean Body Mass Section */}
                                <View className="mb-6 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-2 flex-row items-start justify-between">
                                                <View className="flex-1">
                                                        <CText className="mb-1">Lean Body Mass (kg)</CText>
                                                        <CText className="text-lg" weight="bold">
                                                                {bodyComposition
                                                                        ? `${bodyComposition.leanBodyMass} kg`
                                                                        : '--'}
                                                        </CText>
                                                </View>
                                        </View>
                                        <CText className="text-sm">
                                                {bodyComposition
                                                        ? 'Total muscle, bone, and organ mass'
                                                        : 'To view this index, you need to fill in neck, waist, hip measurements.'}
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
                                disableSave={isSaveDisabled}
                        >
                                {renderModalContent()}
                        </EditModal>

                        {/* Measurement Log Modal */}
                        <MeasurementLogModal
                                visible={logModalVisible}
                                logs={logs}
                                onClose={() => setLogModalVisible(false)}
                                onDeleteLog={handleDeleteMeasurementLog}
                        />

                        <ConfirmationModal
                                visible={confirmVisible}
                                title="Delete measurement log?"
                                message="Are you sure you want to delete this measurement log? This action cannot be undone."
                                confirmText="Delete"
                                cancelText="Cancel"
                                danger
                                onCancel={() => {
                                        setConfirmVisible(false);
                                        setPendingDeleteIndex(null);
                                }}
                                onConfirm={confirmDelete}
                        />
                </SafeAreaView>
        );
};
