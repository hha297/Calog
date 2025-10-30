import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DiaryEntry {
        id: string;
        code: string;
        name: string;
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        fiber?: number;
        imageUrl?: string;
        brand?: string;
        timestamp: string; // ISO
        quantityGrams?: number; // default 100
}

interface DiaryState {
        mealLogs: Record<MealType, DiaryEntry[]>;
        addEntry: (
                meal: MealType,
                entry: Omit<DiaryEntry, 'timestamp' | 'id'> & Partial<Pick<DiaryEntry, 'timestamp'>>,
        ) => void;
        removeEntry: (meal: MealType, id: string) => void;
        clearMeal: (meal: MealType) => void;
        setMealLogs: (logs: Record<MealType, DiaryEntry[]>) => void;
        getCount: (meal: MealType) => number;
        getTotals: (meal: MealType) => { calories: number; protein: number; carbs: number; fat: number; fiber: number };
}

export const useDiaryStore = create<DiaryState>()(
        persist(
                (set, get) => ({
                        mealLogs: {
                                breakfast: [],
                                lunch: [],
                                dinner: [],
                                snack: [],
                        },
                        addEntry: (meal, entry) => {
                                const timestamp = entry.timestamp || new Date().toISOString();
                                const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                                set((state) => ({
                                        mealLogs: {
                                                ...state.mealLogs,
                                                [meal]: [
                                                        ...state.mealLogs[meal],
                                                        { quantityGrams: 100, ...entry, timestamp, id },
                                                ],
                                        },
                                }));
                        },
                        removeEntry: (meal, id) =>
                                set((state) => ({
                                        mealLogs: {
                                                ...state.mealLogs,
                                                [meal]: state.mealLogs[meal].filter((e) => e.id !== id),
                                        },
                                })),
                        clearMeal: (meal) =>
                                set((state) => ({
                                        mealLogs: { ...state.mealLogs, [meal]: [] },
                                })),
                        setMealLogs: (logs) =>
                                set(() => ({
                                        mealLogs: logs,
                                })),
                        getCount: (meal) => get().mealLogs[meal]?.length || 0,
                        getTotals: (meal) => {
                                const items = get().mealLogs[meal] || [];
                                return items.reduce(
                                        (acc, it) => {
                                                const factor = (it.quantityGrams || 100) / 100;
                                                acc.calories += (it.calories || 0) * factor;
                                                acc.protein += (it.protein || 0) * factor;
                                                acc.carbs += (it.carbs || 0) * factor;
                                                acc.fat += (it.fat || 0) * factor;
                                                acc.fiber += (it.fiber || 0) * factor;
                                                return acc;
                                        },
                                        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                                );
                        },
                }),
                {
                        name: 'diary-meal-logs',
                        storage: createJSONStorage(() => AsyncStorage),
                        partialize: (state) => ({ mealLogs: state.mealLogs }),
                },
        ),
);
