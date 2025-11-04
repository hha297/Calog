import React, { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CText } from '../../ui';
import { Plus, ChevronDown, ChevronUp, Activity } from 'lucide-react-native';
import { COLORS } from '../../../style/color';
import { ExerciseSearchModal } from './ExerciseSearchModal';
import { ExerciseItemCard } from './ExerciseItemCard';
import { addExerciseEntry, getDailyExercises, deleteExerciseEntry } from '../../../services/api/exerciseLogApi';
import { useTheme } from '../../../contexts';

interface ExerciseEntry {
        id: string;
        name: string;
        durationMinutes?: number;
        calories?: number;
        description?: string;
        timestamp: string;
}

export const ExerciseDiary: React.FC<{ selectedDate?: Date; onExercisesChange?: () => void }> = ({
        selectedDate,
        onExercisesChange,
}) => {
        const { isDark } = useTheme();
        const [expanded, setExpanded] = useState<boolean>(true);
        const [showSearchModal, setShowSearchModal] = useState(false);
        const [exerciseLogs, setExerciseLogs] = useState<ExerciseEntry[]>([]);

        const getTotalCalories = () => {
                const total = exerciseLogs.reduce((acc, it) => {
                        return acc + (it.calories || 0);
                }, 0);
                return Math.round(total);
        };

        const getTotalDuration = () => {
                const total = exerciseLogs.reduce((acc, it) => {
                        return acc + (it.durationMinutes || 0);
                }, 0);
                return total;
        };

        const startOfDayISO = useMemo(() => {
                const d = new Date(selectedDate || new Date());
                d.setHours(0, 0, 0, 0);
                return d.toISOString();
        }, [selectedDate]);

        useEffect(() => {
                const load = async () => {
                        try {
                                const res: any = await getDailyExercises(startOfDayISO);
                                const day = Array.isArray(res?.data) ? res.data[0] : res?.[0] || null;
                                if (day?.exercises) {
                                        const exercises = day.exercises.map((e: any) => ({
                                                id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                                                name: e.name,
                                                durationMinutes: e.durationMinutes || 30,
                                                calories: e.calories || 0,
                                                description: e.description,
                                                timestamp: new Date(e.timestamp || day.date).toISOString(),
                                        }));
                                        setExerciseLogs(exercises);
                                } else {
                                        setExerciseLogs([]);
                                }
                        } catch (e) {
                                setExerciseLogs([]);
                        }
                };
                load();
        }, [startOfDayISO]);

        const handleAddExercisePress = () => {
                setShowSearchModal(true);
        };

        const handleSelectExercise = async (
                exercise: { name: string; caloriesPer30Min: number; description?: string },
                durationMinutes: number,
        ) => {
                const date = new Date(selectedDate || new Date());
                date.setHours(0, 0, 0, 0);
                const calories = Math.round((exercise.caloriesPer30Min / 30) * durationMinutes);
                try {
                        await addExerciseEntry(date.toISOString(), {
                                name: exercise.name,
                                durationMinutes,
                                calories,
                                timestamp: new Date().toISOString(),
                        });
                        setExerciseLogs((prev) => [
                                ...prev,
                                {
                                        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                                        name: exercise.name,
                                        durationMinutes,
                                        calories,
                                        description: exercise.description,
                                        timestamp: new Date().toISOString(),
                                },
                        ]);
                        onExercisesChange?.();
                        setShowSearchModal(false);
                } catch (error) {
                        console.error('Error adding exercise entry:', error);
                        throw error;
                }
        };

        return (
                <View className="rounded-2xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                        <CText size="lg" weight="semibold" className="mb-3 text-textPrimary dark:text-textPrimary-dark">
                                Exercise Diary
                        </CText>

                        <View className="mb-2 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                        <View className="size-16 items-center justify-center overflow-hidden rounded-full bg-primary/20">
                                                <Activity size={24} color={COLORS.PRIMARY} />
                                        </View>
                                        <View>
                                                <CText
                                                        weight="medium"
                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        {exerciseLogs.length}{' '}
                                                        {exerciseLogs.length !== 1 ? 'activities' : 'activity'},{' '}
                                                        {getTotalDuration()} min, {getTotalCalories()} kcal
                                                </CText>
                                                <CText className="mt-1 text-textSecondary dark:text-textSecondary-dark">
                                                        {selectedDate
                                                                ? new Date(selectedDate).toLocaleDateString('en-US', {
                                                                          month: 'numeric',
                                                                          day: 'numeric',
                                                                          year: 'numeric',
                                                                  })
                                                                : new Date().toLocaleDateString('en-US', {
                                                                          month: 'numeric',
                                                                          day: 'numeric',
                                                                          year: 'numeric',
                                                                  })}
                                                </CText>
                                        </View>
                                </View>
                                <TouchableOpacity
                                        onPress={handleAddExercisePress}
                                        activeOpacity={0.7}
                                        className="size-10 items-center justify-center rounded-full bg-surfaceSecondary dark:bg-surfaceSecondary-dark"
                                >
                                        <Plus size={20} color={COLORS.PRIMARY} strokeWidth={2} />
                                </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                                onPress={() => setExpanded((v) => !v)}
                                className="mb-3 mt-2 flex-row items-center justify-center rounded-lg bg-surfaceSecondary py-2 dark:bg-surfaceSecondary-dark"
                        >
                                <CText weight="medium" className="mr-2 text-primary">
                                        {expanded ? 'Hide activity details' : 'View activity details'}
                                </CText>
                                {expanded ? (
                                        <ChevronUp size={18} color="#59C36A" strokeWidth={2} />
                                ) : (
                                        <ChevronDown size={18} color="#59C36A" strokeWidth={2} />
                                )}
                        </TouchableOpacity>

                        {expanded && (
                                <View className="rounded-xl py-4">
                                        <CText
                                                size="lg"
                                                weight="medium"
                                                className="mb-3 text-textPrimary dark:text-textPrimary-dark"
                                        >
                                                Activity details
                                        </CText>
                                        {exerciseLogs.length === 0 ? (
                                                <View className="mb-3 items-center justify-center rounded-xl border border-surfaceSecondary p-4 dark:border-surfaceSecondary-dark">
                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                You have no activities yet. Add your first activity!
                                                        </CText>
                                                </View>
                                        ) : (
                                                <View className="mb-3 rounded-xl border border-surfaceSecondary px-3 py-3 dark:border-surfaceSecondary-dark">
                                                        {exerciseLogs.map((e, idx) => (
                                                                <ExerciseItemCard
                                                                        key={e.id}
                                                                        name={e.name}
                                                                        durationMinutes={e.durationMinutes}
                                                                        calories={e.calories}
                                                                        description={e.description}
                                                                        onDelete={() => {
                                                                                const date = new Date(
                                                                                        selectedDate || new Date(),
                                                                                );
                                                                                date.setHours(0, 0, 0, 0);
                                                                                deleteExerciseEntry(
                                                                                        date.toISOString(),
                                                                                        idx,
                                                                                )
                                                                                        .then(() => {
                                                                                                setExerciseLogs(
                                                                                                        (prev) =>
                                                                                                                prev.filter(
                                                                                                                        (
                                                                                                                                _,
                                                                                                                                i,
                                                                                                                        ) =>
                                                                                                                                i !==
                                                                                                                                idx,
                                                                                                                ),
                                                                                                );
                                                                                                onExercisesChange?.();
                                                                                        })
                                                                                        .catch(() => {});
                                                                        }}
                                                                />
                                                        ))}
                                                        <View className="mt-2">
                                                                <View className="mb-1 flex-row items-center justify-between">
                                                                        <CText
                                                                                weight="semibold"
                                                                                className="text-primary"
                                                                        >
                                                                                Total activity
                                                                        </CText>
                                                                        <CText
                                                                                weight="semibold"
                                                                                className="text-primary"
                                                                        >
                                                                                {getTotalCalories()} kcal
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                </View>
                                        )}
                                        <View className="items-center justify-center rounded-xl pt-4">
                                                <TouchableOpacity
                                                        onPress={handleAddExercisePress}
                                                        activeOpacity={0.8}
                                                        className="flex-row items-center justify-center gap-2 rounded-full bg-primary px-4 py-2"
                                                >
                                                        <Plus
                                                                size={20}
                                                                color={COLORS.TEXT_PRIMARY_DARK}
                                                                strokeWidth={2}
                                                        />
                                                        <CText
                                                                weight="medium"
                                                                className="text-white dark:text-textPrimary-dark"
                                                        >
                                                                Add your activity
                                                        </CText>
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        )}

                        {/* Exercise Search Modal */}
                        <ExerciseSearchModal
                                visible={showSearchModal}
                                onClose={() => setShowSearchModal(false)}
                                selectedDate={selectedDate || new Date()}
                                onSelectExercise={handleSelectExercise}
                        />
                </View>
        );
};
