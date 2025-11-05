import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Image, ImageSourcePropType, View, TouchableOpacity } from 'react-native';
import { CText } from '../../ui';
import { Plus, ChevronDown, ChevronUp, X as XIcon, Wheat, Beef, Droplet } from 'lucide-react-native';
import { COLORS } from '../../../style/color';
import { FoodSearchModal } from './FoodSearchModal';
import { FoodItemCard } from './FoodItemCard';
import { FoodDetailModal } from './FoodDetailModal';
import { addMealEntry, getDailyMeals, deleteMealEntry } from '../../../services/api/mealLogApi';
import { useTheme } from '../../../contexts';
import { fetchProductByBarcode, parseOpenFoodFactsData } from '../../../services/api/foodApi';
import { updateMealEntry } from '../../../services/api/mealLogApi';

type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealItem {
        key: MealKey;
        title: string;
        image: ImageSourcePropType;
}

const MEALS: MealItem[] = [
        { key: 'breakfast', title: 'Breakfast', image: require('../../../assets/images/breakfast.png') },
        { key: 'lunch', title: 'Lunch', image: require('../../../assets/images/lunch.png') },
        { key: 'dinner', title: 'Dinner', image: require('../../../assets/images/dinner.png') },
        { key: 'snack', title: 'Snack', image: require('../../../assets/images/dessert.png') },
];

interface DiaryEntry {
        id: string;
        code?: string;
        name: string;
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        fiber?: number;
        imageUrl?: string;
        brand?: string;
        timestamp: string;
        quantityGrams?: number;
}

export const FoodDiary: React.FC<{ 
        selectedDate?: Date; 
        onMealsChange?: () => void;
        onTotalsChange?: (totals: { calories: number; protein: number; carbs: number; fat: number; fiber: number }) => void;
}> = ({
        selectedDate,
        onMealsChange,
        onTotalsChange,
}) => {
        const { isDark } = useTheme();
        const [expanded, setExpanded] = useState<boolean>(true);
        const [showSearchModal, setShowSearchModal] = useState(false);
        const [selectedMealType, setSelectedMealType] = useState<MealKey | null>(null);
        const [showDetailModal, setShowDetailModal] = useState(false);
        const [detailFood, setDetailFood] = useState<{
                code: string;
                name: string;
                calories?: number;
                protein?: number;
                carbs?: number;
                fat?: number;
                fiber?: number;
                imageUrl?: string;
                brand?: string;
                quantityGrams?: number;
        } | null>(null);
        const [detailMealType, setDetailMealType] = useState<MealKey>('breakfast');
        const [mealLogs, setMealLogs] = useState<Record<MealKey, DiaryEntry[]>>({
                breakfast: [],
                lunch: [],
                dinner: [],
                snack: [],
        });

        const getMealCalories = (mealKey: MealKey) => {
                const items = mealLogs[mealKey] || [];
                const total = items.reduce((acc, it) => {
                        const f = (it.quantityGrams ?? 100) / 100;
                        return acc + (it.calories || 0) * f;
                }, 0);
                return Math.round(total);
        };

        // Calculate totals from current mealLogs state
        const calculateTotals = useCallback(() => {
                const all = ['breakfast', 'lunch', 'dinner', 'snack'] as MealKey[];
                const totals = all.reduce(
                        (acc, mealKey) => {
                                const items = mealLogs[mealKey] || [];
                                items.forEach((it) => {
                                        const f = (it.quantityGrams ?? 100) / 100;
                                        acc.calories += (it.calories || 0) * f;
                                        acc.protein += (it.protein || 0) * f;
                                        acc.carbs += (it.carbs || 0) * f;
                                        acc.fat += (it.fat || 0) * f;
                                        acc.fiber += (it.fiber || 0) * f;
                                });
                                return acc;
                        },
                        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                );
                return {
                        calories: Math.round(totals.calories),
                        protein: Math.round(totals.protein * 10) / 10,
                        carbs: Math.round(totals.carbs * 10) / 10,
                        fat: Math.round(totals.fat * 10) / 10,
                        fiber: Math.round(totals.fiber * 10) / 10,
                };
        }, [mealLogs]);

        const startOfDayISO = useMemo(() => {
                const d = new Date(selectedDate || new Date());
                d.setHours(0, 0, 0, 0);
                return d.toISOString();
        }, [selectedDate]);

        // Update parent totals whenever mealLogs changes
        useEffect(() => {
                const totals = calculateTotals();
                onTotalsChange?.(totals);
        }, [mealLogs, calculateTotals, onTotalsChange]);

        useEffect(() => {
                const load = async () => {
                        try {
                                const res: any = await getDailyMeals(startOfDayISO);
                                const day = Array.isArray(res?.data) ? res.data[0] : res?.[0] || null;
                                if (day?.meals) {
                                        const m = day.meals;

                                        // Helper function to map meal entries
                                        const mapMealEntries = (entries: any[]) => {
                                                return entries.map((e: any) => ({
                                                        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                                                        code: e.code,
                                                        name: e.name,
                                                        brand: e.brand,
                                                        imageUrl: e.imageUrl,
                                                        calories: e.calories,
                                                        protein: e.protein,
                                                        carbs: e.carbs,
                                                        fat: e.fat,
                                                        fiber: e.fiber,
                                                        quantityGrams: e.quantityGrams || 100,
                                                        timestamp: new Date(e.timestamp || day.date).toISOString(),
                                                }));
                                        };

                                        const mappedMeals = {
                                                breakfast: mapMealEntries(m.breakfast || []),
                                                lunch: mapMealEntries(m.lunch || []),
                                                dinner: mapMealEntries(m.dinner || []),
                                                snack: mapMealEntries(m.snack || []),
                                        };

                                        setMealLogs(mappedMeals);

                                        // Fetch missing nutrients for entries with barcode but missing nutrients
                                        const allEntries: Array<{
                                                mealType: MealKey;
                                                index: number;
                                                entry: DiaryEntry;
                                        }> = [];
                                        (['breakfast', 'lunch', 'dinner', 'snack'] as MealKey[]).forEach((mealType) => {
                                                mappedMeals[mealType].forEach((entry, index) => {
                                                        const hasCode = entry.code && entry.code.trim() !== '';
                                                        const hasMissingNutrients =
                                                                (entry.protein === 0 &&
                                                                        entry.carbs === 0 &&
                                                                        entry.fat === 0) ||
                                                                (!entry.protein && !entry.carbs && !entry.fat);
                                                        if (
                                                                hasCode &&
                                                                hasMissingNutrients &&
                                                                entry.calories &&
                                                                entry.calories > 0
                                                        ) {
                                                                allEntries.push({ mealType, index, entry });
                                                        }
                                                });
                                        });

                                        // Fetch nutrients for entries that need it
                                        for (const { mealType, index, entry } of allEntries) {
                                                try {
                                                        const product = await fetchProductByBarcode(entry.code!);
                                                        if (!product?.product) {
                                                                continue;
                                                        }
                                                        const parsed = parseOpenFoodFactsData(product);
                                                        if (!parsed?.nutrients) {
                                                                continue;
                                                        }
                                                        const nutrients = parsed.nutrients;
                                                        // Update in database
                                                        try {
                                                                await updateMealEntry(startOfDayISO, mealType, index, {
                                                                        protein: nutrients.protein || 0,
                                                                        carbs: nutrients.carbs || 0,
                                                                        fat: nutrients.fat || 0,
                                                                        fiber: nutrients.fiber || 0,
                                                                        calories:
                                                                                nutrients.calories ||
                                                                                entry.calories ||
                                                                                0,
                                                                });
                                                                // Update local state
                                                                setMealLogs((prev) => {
                                                                        const updated = { ...prev };
                                                                        const list = [...updated[mealType]];
                                                                        if (list[index]) {
                                                                                list[index] = {
                                                                                        ...list[index],
                                                                                        protein: nutrients.protein || 0,
                                                                                        carbs: nutrients.carbs || 0,
                                                                                        fat: nutrients.fat || 0,
                                                                                        fiber: nutrients.fiber || 0,
                                                                                        calories:
                                                                                                nutrients.calories ||
                                                                                                list[index].calories ||
                                                                                                0,
                                                                                };
                                                                                updated[mealType] = list;
                                                                        }
                                                                        return updated;
                                                                });
                                                                // Notify parent to refresh totals
                                                                onMealsChange?.();
                                                        } catch (updateError) {
                                                                console.error(
                                                                        `Error updating meal entry for ${entry.name}:`,
                                                                        updateError,
                                                                );
                                                                // Still update local state even if DB update fails
                                                                setMealLogs((prev) => {
                                                                        const updated = { ...prev };
                                                                        const list = [...updated[mealType]];
                                                                        if (list[index]) {
                                                                                list[index] = {
                                                                                        ...list[index],
                                                                                        protein: nutrients.protein || 0,
                                                                                        carbs: nutrients.carbs || 0,
                                                                                        fat: nutrients.fat || 0,
                                                                                        fiber: nutrients.fiber || 0,
                                                                                        calories:
                                                                                                nutrients.calories ||
                                                                                                list[index].calories ||
                                                                                                0,
                                                                                };
                                                                                updated[mealType] = list;
                                                                        }
                                                                        return updated;
                                                                });
                                                        }
                                                } catch (error) {
                                                        console.error(
                                                                `Error fetching nutrients for ${entry.name}:`,
                                                                error,
                                                        );
                                                }
                                        }
                                } else {
                                        setMealLogs({ breakfast: [], lunch: [], dinner: [], snack: [] });
                                }
                        } catch (e) {
                                setMealLogs({ breakfast: [], lunch: [], dinner: [], snack: [] });
                        }
                };
                load();
        }, [startOfDayISO]);

        const handleMealPress = (mealKey: MealKey) => {
                setSelectedMealType(mealKey);
                setShowSearchModal(true);
        };

        const handleAddMealPress = () => {
                setSelectedMealType(null);
                setShowSearchModal(true);
        };

        const handleSelectFood = async (
                food: { code: string; name: string; calories?: number; imageUrl?: string; brand?: string },
                mealType: MealKey,
        ) => {
                const date = new Date(selectedDate || new Date());
                date.setHours(0, 0, 0, 0);
                const newIndex = (mealLogs[mealType] || []).length; // index in server after append
                try {
                        await addMealEntry(date.toISOString(), mealType, {
                                code: food.code,
                                name: food.name,
                                brand: food.brand,
                                imageUrl: food.imageUrl,
                                calories: food.calories,
                                quantityGrams: 100,
                                timestamp: new Date().toISOString(),
                        });
                        setMealLogs((prev) => ({
                                ...prev,
                                [mealType]: [
                                        ...prev[mealType],
                                        {
                                                id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                                                code: food.code,
                                                name: food.name,
                                                brand: food.brand,
                                                imageUrl: food.imageUrl,
                                                calories: food.calories,
                                                protein: 0,
                                                carbs: 0,
                                                fat: 0,
                                                quantityGrams: 100,
                                                timestamp: new Date().toISOString(),
                                        },
                                ],
                        }));
                        onMealsChange?.();

                        // If macros are missing, try to fetch from barcode and update server and local state
                        // Run this in background without blocking the main add operation
                        if (food.code) {
                                (async () => {
                                        try {
                                                const product = await fetchProductByBarcode(food.code!);
                                                if (!product?.product) {
                                                        return; // No product found, skip
                                                }
                                                const parsed = parseOpenFoodFactsData(product);
                                                if (!parsed?.nutrients) {
                                                        return; // No nutrients found, skip
                                                }
                                                const n = parsed.nutrients;
                                                // Update in database, but don't fail the whole operation if this fails
                                                try {
                                                        await updateMealEntry(date.toISOString(), mealType, newIndex, {
                                                                protein: n.protein || 0,
                                                                carbs: n.carbs || 0,
                                                                fat: n.fat || 0,
                                                                fiber: n.fiber || 0,
                                                                calories:
                                                                        typeof food.calories === 'number'
                                                                                ? food.calories
                                                                                : n.calories || 0,
                                                        });
                                                } catch (updateError: any) {
                                                        console.error(
                                                                'Error updating meal entry with nutrients:',
                                                                updateError?.message || updateError,
                                                        );
                                                        // Continue to update local state even if DB update fails
                                                }
                                                // Always update local state with nutrients
                                                setMealLogs((prev) => {
                                                        const list = [...prev[mealType]];
                                                        if (list[newIndex]) {
                                                                list[newIndex] = {
                                                                        ...list[newIndex],
                                                                        protein: n.protein || 0,
                                                                        carbs: n.carbs || 0,
                                                                        fat: n.fat || 0,
                                                                        fiber: n.fiber || 0,
                                                                        calories:
                                                                                typeof food.calories === 'number'
                                                                                        ? food.calories
                                                                                        : n.calories ||
                                                                                          list[newIndex].calories ||
                                                                                          0,
                                                                } as any;
                                                        }
                                                        return { ...prev, [mealType]: list } as any;
                                                });
                                                onMealsChange?.();
                                        } catch (error: any) {
                                                console.error(
                                                        'Error fetching nutrients from barcode:',
                                                        error?.message || error,
                                                );
                                                // Don't throw - allow food to be added even if nutrients fetch fails
                                        }
                                })();
                        }
                } catch (error) {
                        console.error('Error adding meal entry:', error);
                        throw error; // Re-throw to let FoodSearchModal handle it
                }
        };

        return (
                <View className="rounded-2xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                        <CText size="lg" weight="semibold" className="mb-3 text-textPrimary dark:text-textPrimary-dark">
                                Food diary
                        </CText>

                        <View className="mb-2 flex-row items-center justify-between">
                                {MEALS.map((meal) => (
                                        <View key={meal.key} className="items-center">
                                                <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        onPress={() => handleMealPress(meal.key)}
                                                >
                                                        <View className="relative">
                                                                <View className="size-16 overflow-hidden rounded-full">
                                                                        <Image
                                                                                source={meal.image}
                                                                                className="size-16"
                                                                                resizeMode="cover"
                                                                        />
                                                                        {(() => {
                                                                                const kcal = getMealCalories(meal.key);
                                                                                if (kcal > 0) {
                                                                                        return (
                                                                                                <View className="absolute inset-0 items-center justify-center bg-background-dark/80">
                                                                                                        <CText
                                                                                                                weight="semibold"
                                                                                                                className="text-center text-white"
                                                                                                        >
                                                                                                                {kcal}
                                                                                                        </CText>
                                                                                                </View>
                                                                                        );
                                                                                }
                                                                                return null;
                                                                        })()}
                                                                </View>
                                                                <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-primary">
                                                                        <Plus size={16} color="#fff" strokeWidth={2} />
                                                                </View>
                                                        </View>
                                                </TouchableOpacity>
                                                <CText className="mt-2 text-textSecondary dark:text-textSecondary-dark">
                                                        {meal.title}
                                                </CText>
                                        </View>
                                ))}
                        </View>

                        <TouchableOpacity
                                onPress={() => setExpanded((v) => !v)}
                                className="mb-3 mt-2 flex-row items-center justify-center rounded-lg bg-surfaceSecondary py-2 dark:bg-surfaceSecondary-dark"
                        >
                                <CText weight="medium" className="mr-2 text-primary">
                                        {expanded ? 'Hide meal details' : 'View meal details'}
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
                                                Meal details
                                        </CText>
                                        {(() => {
                                                const totalItems =
                                                        (mealLogs.breakfast?.length || 0) +
                                                        (mealLogs.lunch?.length || 0) +
                                                        (mealLogs.dinner?.length || 0) +
                                                        (mealLogs.snack?.length || 0);
                                                if (totalItems === 0) {
                                                        return (
                                                                <View className="mb-3 items-center justify-center rounded-xl border border-surfaceSecondary p-4 dark:border-surfaceSecondary-dark">
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                You have no meals yet. Add your first
                                                                                food!
                                                                        </CText>
                                                                </View>
                                                        );
                                                }
                                                return null;
                                        })()}
                                        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealKey[])
                                                .filter((m) => (mealLogs[m] || []).length > 0)
                                                .map((meal) => (
                                                        <View
                                                                key={meal}
                                                                className="mb-3 rounded-xl border border-surfaceSecondary px-3 py-3 dark:border-surfaceSecondary-dark"
                                                        >
                                                                <CText
                                                                        weight="semibold"
                                                                        className="mb-2 capitalize text-textPrimary dark:text-textPrimary-dark"
                                                                >
                                                                        {meal}
                                                                </CText>
                                                                {mealLogs[meal]?.map((e, idx) => (
                                                                        <FoodItemCard
                                                                                key={e.id}
                                                                                name={e.name}
                                                                                imageUrl={e.imageUrl}
                                                                                quantityGrams={e.quantityGrams}
                                                                                calories={e.calories}
                                                                                carbs={e.carbs}
                                                                                protein={e.protein}
                                                                                fat={e.fat}
                                                                                onPress={() => {
                                                                                        setDetailMealType(meal);
                                                                                        const foodData = {
                                                                                                code: e.code || '',
                                                                                                name: e.name,
                                                                                                brand: e.brand,
                                                                                                imageUrl: e.imageUrl,
                                                                                                calories:
                                                                                                        e.calories ?? 0,
                                                                                                protein: e.protein ?? 0,
                                                                                                carbs: e.carbs ?? 0,
                                                                                                fat: e.fat ?? 0,
                                                                                                fiber: e.fiber ?? 0,
                                                                                                quantityGrams:
                                                                                                        e.quantityGrams ??
                                                                                                        100,
                                                                                        };
                                                                                        console.log(
                                                                                                'Setting detailFood in FoodDiary:',
                                                                                                foodData,
                                                                                        );
                                                                                        setDetailFood(foodData);
                                                                                        setShowDetailModal(true);
                                                                                }}
                                                                                onDelete={() => {
                                                                                        const date = new Date(
                                                                                                selectedDate ||
                                                                                                        new Date(),
                                                                                        );
                                                                                        date.setHours(0, 0, 0, 0);
                                                                                        deleteMealEntry(
                                                                                                date.toISOString(),
                                                                                                meal,
                                                                                                idx,
                                                                                        )
                                                                                                .then(() => {
                                                                                                        setMealLogs(
                                                                                                                (
                                                                                                                        prev,
                                                                                                                ) => ({
                                                                                                                        ...prev,
                                                                                                                        [meal]: prev[
                                                                                                                                meal
                                                                                                                        ].filter(
                                                                                                                                (
                                                                                                                                        _,
                                                                                                                                        i,
                                                                                                                                ) =>
                                                                                                                                        i !==
                                                                                                                                        idx,
                                                                                                                        ),
                                                                                                                }),
                                                                                                        );
                                                                                                        onMealsChange?.();
                                                                                                })
                                                                                                .catch(() => {});
                                                                                }}
                                                                        />
                                                                ))}
                                                                {(() => {
                                                                        const items = mealLogs[meal] || [];
                                                                        const totals = items.reduce(
                                                                                (acc, it) => {
                                                                                        const f =
                                                                                                (it.quantityGrams ??
                                                                                                        100) / 100;
                                                                                        acc.calories +=
                                                                                                (it.calories || 0) * f;
                                                                                        acc.protein +=
                                                                                                (it.protein || 0) * f;
                                                                                        acc.carbs +=
                                                                                                (it.carbs || 0) * f;
                                                                                        acc.fat += (it.fat || 0) * f;
                                                                                        return acc;
                                                                                },
                                                                                {
                                                                                        calories: 0,
                                                                                        protein: 0,
                                                                                        carbs: 0,
                                                                                        fat: 0,
                                                                                },
                                                                        );
                                                                        return (
                                                                                <View className="mt-2">
                                                                                        <View className="mb-1 flex-row items-center justify-between">
                                                                                                <CText
                                                                                                        weight="semibold"
                                                                                                        className="text-primary"
                                                                                                >
                                                                                                        Nutrition total
                                                                                                </CText>
                                                                                                <CText
                                                                                                        weight="semibold"
                                                                                                        className="text-primary"
                                                                                                >
                                                                                                        {Math.round(
                                                                                                                totals.calories,
                                                                                                        )}{' '}
                                                                                                        kcal
                                                                                                </CText>
                                                                                        </View>
                                                                                        <View className="flex-row items-center justify-between gap-4">
                                                                                                <View className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary/20 p-2">
                                                                                                        <Wheat
                                                                                                                size={
                                                                                                                        16
                                                                                                                }
                                                                                                                color={
                                                                                                                        COLORS.PRIMARY
                                                                                                                }
                                                                                                        />
                                                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                                                {Math.round(
                                                                                                                        totals.carbs,
                                                                                                                )}{' '}
                                                                                                                g
                                                                                                        </CText>
                                                                                                </View>
                                                                                                <View className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-status-error/20 p-2">
                                                                                                        <Beef
                                                                                                                size={
                                                                                                                        16
                                                                                                                }
                                                                                                                color={
                                                                                                                        COLORS.ERROR
                                                                                                                }
                                                                                                        />
                                                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                                                {Math.round(
                                                                                                                        totals.protein,
                                                                                                                )}{' '}
                                                                                                                g
                                                                                                        </CText>
                                                                                                </View>
                                                                                                <View className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-status-warning/20 p-2">
                                                                                                        <Droplet
                                                                                                                size={
                                                                                                                        16
                                                                                                                }
                                                                                                                color={
                                                                                                                        COLORS.WARNING
                                                                                                                }
                                                                                                        />
                                                                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                                                                {Math.round(
                                                                                                                        totals.fat,
                                                                                                                )}{' '}
                                                                                                                g
                                                                                                        </CText>
                                                                                                </View>
                                                                                        </View>
                                                                                </View>
                                                                        );
                                                                })()}
                                                        </View>
                                                ))}
                                        <View className="items-center justify-center rounded-xl pt-4">
                                                <TouchableOpacity
                                                        onPress={handleAddMealPress}
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
                                                                Add your meal
                                                        </CText>
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        )}

                        {/* Food Search Modal */}
                        <FoodSearchModal
                                visible={showSearchModal}
                                onClose={() => setShowSearchModal(false)}
                                initialMealType={selectedMealType || 'breakfast'}
                                selectedDate={selectedDate || new Date()}
                                onSelectFood={handleSelectFood}
                        />

                        {detailFood && (
                                <FoodDetailModal
                                        visible={showDetailModal}
                                        onClose={() => setShowDetailModal(false)}
                                        food={detailFood}
                                        initialMealType={detailMealType}
                                        selectedDate={selectedDate || new Date()}
                                        mode={'update'}
                                        mealIndex={(() => {
                                                const list = mealLogs[detailMealType] || [];
                                                return Math.max(
                                                        0,
                                                        list.findIndex((x) => x.name === detailFood?.name),
                                                );
                                        })()}
                                        onUpdated={({ quantityGrams }) => {
                                                setMealLogs((prev) => {
                                                        const list = [...(prev[detailMealType] || [])];
                                                        const idx = list.findIndex((x) => x.name === detailFood?.name);
                                                        if (idx >= 0) {
                                                                list[idx] = { ...list[idx], quantityGrams };
                                                        }
                                                        return { ...prev, [detailMealType]: list } as any;
                                                });
                                                onMealsChange?.();
                                        }}
                                />
                        )}
                </View>
        );
};
