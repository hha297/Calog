import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
        View,
        Modal,
        TouchableOpacity,
        TextInput,
        ScrollView,
        ActivityIndicator,
        Pressable,
        Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, X, Plus, Loader2, Check } from 'lucide-react-native';
import { CText } from '../../ui/CText';
import { useTheme } from '../../../contexts';
import { COLORS } from '../../../style/color';
import { EXERCISE_ACTIVITIES, EXERCISE_ACTIVITY_GROUPS } from '../../../constants/exerciseActivities';
import { Flame, User } from 'lucide-react-native';
import { getUserActivities, createActivity, Activity } from '../../../services/api/activityApi';

interface ExerciseSearchResult {
        name: string;
        caloriesPer30Min: number;
        description?: string;
        isCustom?: boolean; // To distinguish user activities from default ones
        activityId?: string; // ID from database if it's a user activity
}

interface ExerciseSearchModalProps {
        visible: boolean;
        onClose: () => void;
        selectedDate?: Date;
        onSelectExercise?: (exercise: ExerciseSearchResult, durationMinutes: number) => void | Promise<void>;
}

export const ExerciseSearchModal: React.FC<ExerciseSearchModalProps> = ({
        visible,
        onClose,
        selectedDate,
        onSelectExercise,
}) => {
        const { isDark } = useTheme();
        const [searchQuery, setSearchQuery] = useState('');
        const [searchResults, setSearchResults] = useState<{ group: string; activities: ExerciseSearchResult[] }[]>([]);
        const [isSearching, setIsSearching] = useState(false);
        const [addingExerciseName, setAddingExerciseName] = useState<string | null>(null);
        const [exerciseDurations, setExerciseDurations] = useState<Record<string, number | string>>({});
        const [showAddActivityModal, setShowAddActivityModal] = useState(false);
        const [customActivityName, setCustomActivityName] = useState('');
        const [customActivityCalories, setCustomActivityCalories] = useState('');
        const [customActivityDuration, setCustomActivityDuration] = useState('30');
        const [addToActivityList, setAddToActivityList] = useState(false);
        const [addToToday, setAddToToday] = useState(true);
        const [userActivities, setUserActivities] = useState<Activity[]>([]);
        const [isLoadingUserActivities, setIsLoadingUserActivities] = useState(false);
        const spinAnim = useRef(new Animated.Value(0)).current;

        // Spinning animation for loading icon
        useEffect(() => {
                if (addingExerciseName) {
                        const spin = Animated.loop(
                                Animated.timing(spinAnim, {
                                        toValue: 1,
                                        duration: 1000,
                                        useNativeDriver: true,
                                }),
                        );
                        spin.start();
                        return () => spin.stop();
                } else {
                        spinAnim.setValue(0);
                }
        }, [addingExerciseName, spinAnim]);

        const spin = spinAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
        });

        // Load user activities
        const loadUserActivities = useCallback(async () => {
                setIsLoadingUserActivities(true);
                try {
                        const response = await getUserActivities();
                        if (response && response.success && response.data) {
                                setUserActivities(response.data);
                        } else {
                                setUserActivities([]);
                        }
                } catch (error) {
                        console.error('Error loading user activities:', error);
                        setUserActivities([]);
                } finally {
                        setIsLoadingUserActivities(false);
                }
        }, []);

        // Load user activities when modal opens
        useEffect(() => {
                if (visible) {
                        loadUserActivities();
                }
        }, [visible, loadUserActivities]);

        // Search function for exercises (includes default + user activities, grouped)
        const searchExercises = useCallback(
                (query: string): { group: string; activities: ExerciseSearchResult[] }[] => {
                        const lowerQuery = query.toLowerCase().trim();

                        // Map user activities
                        const customActivities: ExerciseSearchResult[] = userActivities.map((activity) => ({
                                name: activity.name,
                                caloriesPer30Min: activity.caloriesPer30Min,
                                description: activity.description,
                                isCustom: true,
                                activityId: activity._id,
                        }));

                        // Process default activities by groups
                        const groupedResults: { group: string; activities: ExerciseSearchResult[] }[] = [];

                        EXERCISE_ACTIVITY_GROUPS.forEach((group) => {
                                const groupActivities: ExerciseSearchResult[] = group.activities
                                        .map((activity) => ({
                                                name: activity.name,
                                                caloriesPer30Min: activity.caloriesPer30Min,
                                                description: activity.description,
                                                isCustom: false,
                                        }))
                                        .filter((activity) => {
                                                if (!lowerQuery) return true;
                                                return (
                                                        activity.name.toLowerCase().includes(lowerQuery) ||
                                                        activity.description?.toLowerCase().includes(lowerQuery)
                                                );
                                        });

                                if (groupActivities.length > 0) {
                                        groupedResults.push({
                                                group: group.name,
                                                activities: groupActivities,
                                        });
                                }
                        });

                        // Add custom activities group at the beginning if there are any
                        if (customActivities.length > 0) {
                                const filteredCustom = customActivities.filter((activity) => {
                                        if (!lowerQuery) return true;
                                        return (
                                                activity.name.toLowerCase().includes(lowerQuery) ||
                                                activity.description?.toLowerCase().includes(lowerQuery)
                                        );
                                });

                                if (filteredCustom.length > 0) {
                                        groupedResults.unshift({
                                                group: 'My Activities',
                                                activities: filteredCustom,
                                        });
                                }
                        }

                        return groupedResults;
                },
                [userActivities],
        );

        // Debounced search
        useEffect(() => {
                if (!visible) {
                        setSearchQuery('');
                        setSearchResults([]);
                        setExerciseDurations({});
                        return;
                }

                const timeoutId = setTimeout(() => {
                        setIsSearching(true);
                        const results = searchExercises(searchQuery);
                        setSearchResults(results);
                        setIsSearching(false);
                }, 300);

                return () => clearTimeout(timeoutId);
        }, [searchQuery, visible, searchExercises]);

        // Show all activities when modal opens and search is empty
        useEffect(() => {
                if (visible && !searchQuery.trim()) {
                        const allResults = searchExercises('');
                        setSearchResults(allResults);
                }
        }, [visible, searchQuery, searchExercises]);

        const calculateCalories = (caloriesPer30Min: number, durationMinutes: number) => {
                return Math.round((caloriesPer30Min / 30) * durationMinutes);
        };

        const handleAddCustomActivity = async () => {
                if (!customActivityName.trim()) {
                        return;
                }
                const calories = parseFloat(customActivityCalories) || 0;
                const duration = parseInt(customActivityDuration, 10) || 30;
                const caloriesPer30Min = duration > 0 ? (calories / duration) * 30 : 0;

                const customExercise: ExerciseSearchResult = {
                        name: customActivityName.trim(),
                        caloriesPer30Min,
                        description: customActivityName.trim(),
                        isCustom: true,
                };

                try {
                        // Save to activity list if checkbox is checked
                        if (addToActivityList) {
                                try {
                                        await createActivity({
                                                name: customActivityName.trim(),
                                                caloriesPer30Min,
                                                description: customActivityName.trim(),
                                        });
                                        // Reload user activities to show the new one
                                        await loadUserActivities();
                                } catch (error) {
                                        console.error('Error saving activity to list:', error);
                                        // Continue even if save fails
                                }
                        }

                        // Add to today's activity if checkbox is checked
                        if (addToToday && onSelectExercise) {
                                await onSelectExercise(customExercise, duration);
                        }

                        setShowAddActivityModal(false);
                        setCustomActivityName('');
                        setCustomActivityCalories('');
                        setCustomActivityDuration('30');
                        setAddToActivityList(false);
                        setAddToToday(true);
                } catch (error) {
                        console.error('Error adding custom activity:', error);
                }
        };

        return (
                <Modal
                        visible={visible}
                        animationType="slide"
                        transparent={false}
                        statusBarTranslucent={true}
                        onRequestClose={onClose}
                >
                        <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={['top']}>
                                {/* Header */}
                                <View className="flex-row items-center justify-between border-b border-textSecondary/10 px-4 py-3 dark:border-textSecondary/20">
                                        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                                                <ChevronLeft
                                                        size={24}
                                                        color={isDark ? COLORS.ICON_LIGHT : COLORS.ICON_DARK}
                                                />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                onPress={() => setShowAddActivityModal(true)}
                                                className="rounded-lg px-3 py-2"
                                        >
                                                <CText size="lg" weight="semibold" className="text-primary">
                                                        Add Activity
                                                </CText>
                                        </TouchableOpacity>
                                </View>

                                {/* Search Bar */}
                                <View className="border-b border-textSecondary/10 px-4 py-3 dark:border-textSecondary/20">
                                        <View className="flex-row items-center gap-2">
                                                <View className="flex-1 flex-row items-center rounded-xl bg-surfaceSecondary px-4 dark:bg-surfaceSecondary-dark">
                                                        <Search
                                                                size={20}
                                                                color={
                                                                        isDark
                                                                                ? COLORS.TEXT_SECONDARY_DARK
                                                                                : COLORS.TEXT_SECONDARY_LIGHT
                                                                }
                                                        />
                                                        <TextInput
                                                                value={searchQuery}
                                                                onChangeText={setSearchQuery}
                                                                placeholder="Search activity"
                                                                placeholderTextColor={
                                                                        isDark
                                                                                ? COLORS.TEXT_SECONDARY_DARK
                                                                                : COLORS.TEXT_SECONDARY_LIGHT
                                                                }
                                                                className="ml-2 flex-1 text-base text-textPrimary dark:text-textPrimary-dark"
                                                                autoFocus
                                                                style={{ fontFamily: 'SpaceGrotesk-Regular' }}
                                                        />
                                                        {searchQuery.length > 0 && (
                                                                <TouchableOpacity
                                                                        onPress={() => setSearchQuery('')}
                                                                        activeOpacity={0.7}
                                                                >
                                                                        <X
                                                                                size={18}
                                                                                color={
                                                                                        isDark
                                                                                                ? COLORS.TEXT_SECONDARY_DARK
                                                                                                : COLORS.TEXT_SECONDARY_LIGHT
                                                                                }
                                                                        />
                                                                </TouchableOpacity>
                                                        )}
                                                </View>
                                        </View>
                                </View>

                                {/* Search Results */}
                                <ScrollView className="flex-1 px-4 py-2" contentContainerStyle={{ paddingBottom: 20 }}>
                                        {isSearching ? (
                                                <View className="flex-1 items-center justify-center py-20">
                                                        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                                                        <CText className="mt-4 text-textSecondary dark:text-textSecondary-dark">
                                                                Searching...
                                                        </CText>
                                                </View>
                                        ) : searchQuery.trim() && searchResults.length === 0 ? (
                                                <View className="flex-1 items-center justify-center py-20">
                                                        <CText
                                                                size="lg"
                                                                weight="medium"
                                                                className="mt-4 text-center text-textPrimary dark:text-textPrimary-dark"
                                                        >
                                                                No activity found
                                                        </CText>
                                                </View>
                                        ) : (
                                                <View className="gap-4">
                                                        {searchResults.map((group, groupIndex) => (
                                                                <View key={`group-${groupIndex}`} className="gap-2">
                                                                        {/* Group Header */}
                                                                        <CText
                                                                                size="lg"
                                                                                weight="semibold"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                {group.group}
                                                                        </CText>

                                                                        {/* Group Activities */}
                                                                        {group.activities.map((exercise, index) => {
                                                                                const exerciseDurationValue =
                                                                                        exerciseDurations[
                                                                                                exercise.name
                                                                                        ];
                                                                                // Default to 30 if not set, undefined if explicitly empty
                                                                                const finalDuration =
                                                                                        exerciseDurationValue ===
                                                                                                undefined ||
                                                                                        exerciseDurationValue === null
                                                                                                ? 30
                                                                                                : exerciseDurationValue ===
                                                                                                    ''
                                                                                                  ? undefined
                                                                                                  : typeof exerciseDurationValue ===
                                                                                                      'number'
                                                                                                    ? exerciseDurationValue
                                                                                                    : parseInt(
                                                                                                              String(
                                                                                                                      exerciseDurationValue,
                                                                                                              ),
                                                                                                              10,
                                                                                                      ) || undefined;
                                                                                // Display: show "30" if default, empty string if user cleared it, otherwise show the value
                                                                                const displayDuration =
                                                                                        exerciseDurationValue ===
                                                                                                undefined ||
                                                                                        exerciseDurationValue === null
                                                                                                ? '30'
                                                                                                : String(
                                                                                                          exerciseDurationValue,
                                                                                                  );
                                                                                // Only disabled if user explicitly cleared it (empty string)
                                                                                const isDisabled =
                                                                                        exerciseDurationValue === '';
                                                                                const isValidDuration =
                                                                                        !isDisabled &&
                                                                                        finalDuration !== undefined &&
                                                                                        finalDuration !== null &&
                                                                                        !isNaN(finalDuration) &&
                                                                                        finalDuration > 0;
                                                                                const calories = isValidDuration
                                                                                        ? calculateCalories(
                                                                                                  exercise.caloriesPer30Min,
                                                                                                  finalDuration,
                                                                                          )
                                                                                        : 0;
                                                                                return (
                                                                                        <View
                                                                                                key={`${exercise.name}-${groupIndex}-${index}`}
                                                                                                className="flex-row items-center gap-3 rounded-xl bg-surfacePrimary p-3 dark:bg-surfacePrimary-dark"
                                                                                        >
                                                                                                {/* Exercise Info */}
                                                                                                <View className="flex-1">
                                                                                                        <View className="flex-row items-center gap-2">
                                                                                                                <CText
                                                                                                                        weight="medium"
                                                                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                                                                        numberOfLines={
                                                                                                                                2
                                                                                                                        }
                                                                                                                >
                                                                                                                        {
                                                                                                                                exercise.name
                                                                                                                        }
                                                                                                                </CText>
                                                                                                                {exercise.isCustom && (
                                                                                                                        <View className="flex-row items-center gap-2 rounded-full bg-primary/20 px-2 py-0.5">
                                                                                                                                <User
                                                                                                                                        size={
                                                                                                                                                12
                                                                                                                                        }
                                                                                                                                        color={
                                                                                                                                                COLORS.PRIMARY
                                                                                                                                        }
                                                                                                                                />
                                                                                                                                <CText className="text-primary">
                                                                                                                                        Custom
                                                                                                                                </CText>
                                                                                                                        </View>
                                                                                                                )}
                                                                                                        </View>
                                                                                                        {exercise.description && (
                                                                                                                <CText
                                                                                                                        size="sm"
                                                                                                                        className="mt-1 text-textSecondary dark:text-textSecondary-dark"
                                                                                                                >
                                                                                                                        {
                                                                                                                                exercise.description
                                                                                                                        }
                                                                                                                </CText>
                                                                                                        )}
                                                                                                        <View className="mt-1 flex-row items-center gap-1">
                                                                                                                <Flame
                                                                                                                        size={
                                                                                                                                14
                                                                                                                        }
                                                                                                                        color={
                                                                                                                                COLORS.ERROR
                                                                                                                        }
                                                                                                                />
                                                                                                                <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                                                        {
                                                                                                                                exercise.caloriesPer30Min
                                                                                                                        }{' '}
                                                                                                                        kcal/30
                                                                                                                        min
                                                                                                                </CText>
                                                                                                        </View>
                                                                                                        {/* Duration Input */}
                                                                                                        <View className="mt-2 gap-2">
                                                                                                                <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                                                        Duration
                                                                                                                </CText>
                                                                                                                <View className="flex-row items-center gap-3">
                                                                                                                        <View className="flex-row items-center rounded-lg border border-surfaceSecondary px-2 dark:border-surfaceSecondary-dark">
                                                                                                                                <TextInput
                                                                                                                                        value={
                                                                                                                                                displayDuration
                                                                                                                                        }
                                                                                                                                        onChangeText={(
                                                                                                                                                text,
                                                                                                                                        ) => {
                                                                                                                                                if (
                                                                                                                                                        text ===
                                                                                                                                                        ''
                                                                                                                                                ) {
                                                                                                                                                        setExerciseDurations(
                                                                                                                                                                (
                                                                                                                                                                        prev,
                                                                                                                                                                ) => ({
                                                                                                                                                                        ...prev,
                                                                                                                                                                        [exercise.name]:
                                                                                                                                                                                '',
                                                                                                                                                                }),
                                                                                                                                                        );
                                                                                                                                                        return;
                                                                                                                                                }
                                                                                                                                                const num =
                                                                                                                                                        parseInt(
                                                                                                                                                                text,
                                                                                                                                                                10,
                                                                                                                                                        );
                                                                                                                                                if (
                                                                                                                                                        !isNaN(
                                                                                                                                                                num,
                                                                                                                                                        ) &&
                                                                                                                                                        num >
                                                                                                                                                                0
                                                                                                                                                ) {
                                                                                                                                                        setExerciseDurations(
                                                                                                                                                                (
                                                                                                                                                                        prev,
                                                                                                                                                                ) => ({
                                                                                                                                                                        ...prev,
                                                                                                                                                                        [exercise.name]:
                                                                                                                                                                                num,
                                                                                                                                                                }),
                                                                                                                                                        );
                                                                                                                                                } else {
                                                                                                                                                        setExerciseDurations(
                                                                                                                                                                (
                                                                                                                                                                        prev,
                                                                                                                                                                ) => ({
                                                                                                                                                                        ...prev,
                                                                                                                                                                        [exercise.name]:
                                                                                                                                                                                text,
                                                                                                                                                                }),
                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                                        }}
                                                                                                                                        keyboardType="numeric"
                                                                                                                                        className="w-12 text-textPrimary dark:text-textPrimary-dark"
                                                                                                                                        style={{
                                                                                                                                                fontFamily: 'SpaceGrotesk-Regular',
                                                                                                                                        }}
                                                                                                                                />
                                                                                                                                <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                                                                        min
                                                                                                                                </CText>
                                                                                                                        </View>
                                                                                                                        {isValidDuration && (
                                                                                                                                <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                                                                        {
                                                                                                                                                calories
                                                                                                                                        }{' '}
                                                                                                                                        kcal
                                                                                                                                </CText>
                                                                                                                        )}
                                                                                                                </View>
                                                                                                        </View>
                                                                                                </View>

                                                                                                {/* Add Button */}
                                                                                                <TouchableOpacity
                                                                                                        className={`size-10 items-center justify-center rounded-full ${
                                                                                                                !isDisabled
                                                                                                                        ? 'bg-primary'
                                                                                                                        : 'bg-surfaceSecondary opacity-50 dark:bg-surfaceSecondary-dark'
                                                                                                        }`}
                                                                                                        activeOpacity={
                                                                                                                0.7
                                                                                                        }
                                                                                                        onPress={async () => {
                                                                                                                if (
                                                                                                                        addingExerciseName ===
                                                                                                                                exercise.name ||
                                                                                                                        isDisabled ||
                                                                                                                        !isValidDuration
                                                                                                                )
                                                                                                                        return;
                                                                                                                setAddingExerciseName(
                                                                                                                        exercise.name,
                                                                                                                );
                                                                                                                try {
                                                                                                                        if (
                                                                                                                                onSelectExercise &&
                                                                                                                                finalDuration !==
                                                                                                                                        undefined
                                                                                                                        ) {
                                                                                                                                await onSelectExercise(
                                                                                                                                        exercise,
                                                                                                                                        finalDuration,
                                                                                                                                );
                                                                                                                        }
                                                                                                                } catch (error) {
                                                                                                                        console.error(
                                                                                                                                'Error adding exercise:',
                                                                                                                                error,
                                                                                                                        );
                                                                                                                } finally {
                                                                                                                        setAddingExerciseName(
                                                                                                                                null,
                                                                                                                        );
                                                                                                                }
                                                                                                        }}
                                                                                                        disabled={
                                                                                                                addingExerciseName ===
                                                                                                                        exercise.name ||
                                                                                                                isDisabled
                                                                                                        }
                                                                                                >
                                                                                                        {addingExerciseName ===
                                                                                                        exercise.name ? (
                                                                                                                <Animated.View
                                                                                                                        style={{
                                                                                                                                transform: [
                                                                                                                                        {
                                                                                                                                                rotate: spin,
                                                                                                                                        },
                                                                                                                                ],
                                                                                                                        }}
                                                                                                                >
                                                                                                                        <Loader2
                                                                                                                                size={
                                                                                                                                        20
                                                                                                                                }
                                                                                                                                color="#fff"
                                                                                                                        />
                                                                                                                </Animated.View>
                                                                                                        ) : (
                                                                                                                <Plus
                                                                                                                        size={
                                                                                                                                20
                                                                                                                        }
                                                                                                                        color="#fff"
                                                                                                                        strokeWidth={
                                                                                                                                2
                                                                                                                        }
                                                                                                                />
                                                                                                        )}
                                                                                                </TouchableOpacity>
                                                                                        </View>
                                                                                );
                                                                        })}
                                                                </View>
                                                        ))}
                                                </View>
                                        )}
                                </ScrollView>

                                {/* Add Custom Activity Modal */}
                                <Modal
                                        visible={showAddActivityModal}
                                        transparent
                                        animationType="slide"
                                        onRequestClose={() => setShowAddActivityModal(false)}
                                >
                                        <SafeAreaView
                                                className="flex-1 bg-background dark:bg-background-dark"
                                                edges={['top']}
                                        >
                                                <View className="flex-1 px-4 py-6">
                                                        {/* Header */}
                                                        <View className="mb-6 flex-row items-center justify-between">
                                                                <TouchableOpacity
                                                                        onPress={() => setShowAddActivityModal(false)}
                                                                        activeOpacity={0.7}
                                                                >
                                                                        <ChevronLeft
                                                                                size={24}
                                                                                color={
                                                                                        isDark
                                                                                                ? COLORS.ICON_LIGHT
                                                                                                : COLORS.ICON_DARK
                                                                                }
                                                                        />
                                                                </TouchableOpacity>
                                                                <CText
                                                                        size="lg"
                                                                        weight="semibold"
                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        Add Activity
                                                                </CText>
                                                                <View className="w-6" />
                                                        </View>

                                                        {/* Form Fields */}
                                                        <View className="gap-4">
                                                                {/* Activity Name */}
                                                                <View>
                                                                        <CText className="mb-2 text-textPrimary dark:text-textPrimary-dark">
                                                                                Activity Name
                                                                        </CText>
                                                                        <TextInput
                                                                                value={customActivityName}
                                                                                onChangeText={setCustomActivityName}
                                                                                placeholder="Enter activity name"
                                                                                placeholderTextColor={
                                                                                        isDark
                                                                                                ? COLORS.TEXT_SECONDARY_DARK
                                                                                                : COLORS.TEXT_SECONDARY_LIGHT
                                                                                }
                                                                                className="rounded-lg border border-surfaceSecondary bg-surfaceSecondary px-4 py-3 text-textPrimary dark:border-surfaceSecondary-dark dark:bg-surfaceSecondary-dark dark:text-textPrimary-dark"
                                                                                style={{
                                                                                        fontFamily: 'SpaceGrotesk-Regular',
                                                                                }}
                                                                        />
                                                                </View>

                                                                {/* Energy */}
                                                                <View>
                                                                        <CText className="mb-2 text-textPrimary dark:text-textPrimary-dark">
                                                                                Energy
                                                                        </CText>
                                                                        <TextInput
                                                                                value={customActivityCalories}
                                                                                onChangeText={setCustomActivityCalories}
                                                                                placeholder="Kcal"
                                                                                placeholderTextColor={
                                                                                        isDark
                                                                                                ? COLORS.TEXT_SECONDARY_DARK
                                                                                                : COLORS.TEXT_SECONDARY_LIGHT
                                                                                }
                                                                                keyboardType="numeric"
                                                                                className="rounded-lg border border-surfaceSecondary bg-surfaceSecondary px-4 py-3 text-textPrimary dark:border-surfaceSecondary-dark dark:bg-surfaceSecondary-dark dark:text-textPrimary-dark"
                                                                                style={{
                                                                                        fontFamily: 'SpaceGrotesk-Regular',
                                                                                }}
                                                                        />
                                                                </View>

                                                                {/* Time */}
                                                                <View>
                                                                        <CText className="mb-2 text-textPrimary dark:text-textPrimary-dark">
                                                                                Time
                                                                        </CText>
                                                                        <TextInput
                                                                                value={customActivityDuration}
                                                                                onChangeText={setCustomActivityDuration}
                                                                                placeholder="min"
                                                                                placeholderTextColor={
                                                                                        isDark
                                                                                                ? COLORS.TEXT_SECONDARY_DARK
                                                                                                : COLORS.TEXT_SECONDARY_LIGHT
                                                                                }
                                                                                keyboardType="numeric"
                                                                                className="rounded-lg border border-surfaceSecondary bg-surfaceSecondary px-4 py-3 text-textPrimary dark:border-surfaceSecondary-dark dark:bg-surfaceSecondary-dark dark:text-textPrimary-dark"
                                                                                style={{
                                                                                        fontFamily: 'SpaceGrotesk-Regular',
                                                                                }}
                                                                        />
                                                                </View>

                                                                {/* Checkboxes */}
                                                                <View className="gap-3">
                                                                        <TouchableOpacity
                                                                                onPress={() =>
                                                                                        setAddToActivityList(
                                                                                                !addToActivityList,
                                                                                        )
                                                                                }
                                                                                activeOpacity={0.7}
                                                                                className="flex-row items-center gap-3"
                                                                        >
                                                                                <View
                                                                                        className={`size-5 items-center justify-center rounded border-2 ${
                                                                                                addToActivityList
                                                                                                        ? 'border-primary bg-primary'
                                                                                                        : 'border-surfaceSecondary dark:border-surfaceSecondary-dark'
                                                                                        }`}
                                                                                >
                                                                                        {addToActivityList && (
                                                                                                <Check
                                                                                                        size={14}
                                                                                                        color="#fff"
                                                                                                />
                                                                                        )}
                                                                                </View>
                                                                                <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                        Add to activity list
                                                                                </CText>
                                                                        </TouchableOpacity>

                                                                        <TouchableOpacity
                                                                                onPress={() =>
                                                                                        setAddToToday(!addToToday)
                                                                                }
                                                                                activeOpacity={0.7}
                                                                                className="flex-row items-center gap-3"
                                                                        >
                                                                                <View
                                                                                        className={`size-5 items-center justify-center rounded border-2 ${
                                                                                                addToToday
                                                                                                        ? 'border-primary bg-primary'
                                                                                                        : 'border-surfaceSecondary dark:border-surfaceSecondary-dark'
                                                                                        }`}
                                                                                >
                                                                                        {addToToday && (
                                                                                                <Check
                                                                                                        size={14}
                                                                                                        color="#fff"
                                                                                                />
                                                                                        )}
                                                                                </View>
                                                                                <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                        Add to today's activity
                                                                                </CText>
                                                                        </TouchableOpacity>
                                                                </View>
                                                        </View>

                                                        {/* Confirm Button */}
                                                        <View className="mt-auto">
                                                                <TouchableOpacity
                                                                        onPress={handleAddCustomActivity}
                                                                        activeOpacity={0.8}
                                                                        className="rounded-lg bg-primary px-4 py-4"
                                                                >
                                                                        <CText
                                                                                weight="semibold"
                                                                                className="text-center text-white"
                                                                        >
                                                                                Confirm
                                                                        </CText>
                                                                </TouchableOpacity>
                                                        </View>
                                                </View>
                                        </SafeAreaView>
                                </Modal>
                        </SafeAreaView>
                </Modal>
        );
};
