import React, { useState, useEffect } from 'react';
import {
        View,
        Modal,
        TouchableOpacity,
        TextInput,
        ScrollView,
        Image,
        ActivityIndicator,
        Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
        ChevronLeft,
        ChevronDown,
        Heart,
        ChevronUp,
        ChevronRight,
        Check,
        Info,
        Wheat,
        Beef,
        Droplet,
} from 'lucide-react-native';
import { CText, CircularProgress } from '../../ui';
import { useTheme } from '../../../contexts';
import { COLORS } from '../../../style/color';
import { MealType } from '../../../store/diaryStore';
import { addMealEntry, updateMealEntry } from '../../../services/api/mealLogApi';
import { fetchProductByBarcode, parseOpenFoodFactsData, OpenFoodFactsProduct } from '../../../services/api/foodApi';
import { MEAL_OPTIONS } from './FoodSearchModal';

interface FoodDetailModalProps {
        visible: boolean;
        onClose: () => void;
        food: {
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
        };
        initialMealType: MealType;
        selectedDate?: Date;
        mode?: 'add' | 'update';
        mealIndex?: number; // required when mode=update
        onUpdated?: (payload: { quantityGrams: number }) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
        visible,
        onClose,
        food,
        initialMealType,
        selectedDate,
        mode = 'add',
        mealIndex,
        onUpdated,
}) => {
        const { isDark } = useTheme();
        const [servingSize, setServingSize] = useState<string>(
                food.quantityGrams !== undefined ? food.quantityGrams.toString() : '100',
        );
        const [selectedMealType, setSelectedMealType] = useState<MealType>(initialMealType);
        const [showMealDropdown, setShowMealDropdown] = useState(false);
        const [showFullNutrition, setShowFullNutrition] = useState(false);
        const [fullNutritionData, setFullNutritionData] = useState<any>(null);
        const [loadingNutrition, setLoadingNutrition] = useState(false);

        const selectedMeal = MEAL_OPTIONS.find((m) => m.key === selectedMealType);

        // Parse serving size to number, default to 100 if empty or invalid
        const servingSizeNum = servingSize.trim() === '' ? 0 : parseInt(servingSize) || 0;
        const isValidServingSize = servingSizeNum > 0;

        // Calculate nutrition based on serving size
        const factor = servingSizeNum / 100;
        const calories = Math.round((food.calories || 0) * factor);
        const protein = (food.protein || 0) * factor;
        const carbs = (food.carbs || 0) * factor;
        const fat = (food.fat || 0) * factor;

        // Calculate percentages for circular progress
        const totalMacros = protein * 4 + carbs * 4 + fat * 9; // calories from macros
        const proteinPercent = totalMacros > 0 ? ((protein * 4) / totalMacros) * 100 : 0;
        const carbsPercent = totalMacros > 0 ? ((carbs * 4) / totalMacros) * 100 : 0;
        const fatPercent = totalMacros > 0 ? ((fat * 9) / totalMacros) * 100 : 0;

        // Progress for circular chart (using fat as main indicator as shown in image)
        const progressPercent = fatPercent;

        // Fetch full nutrition data from Open Food Facts
        const fetchFullNutrition = async () => {
                if (fullNutritionData || loadingNutrition) return;

                setLoadingNutrition(true);
                try {
                        const product = await fetchProductByBarcode(food.code);
                        if (product?.product) {
                                setFullNutritionData(product.product);
                        }
                } catch (error) {
                        console.error('Error fetching full nutrition:', error);
                } finally {
                        setLoadingNutrition(false);
                }
        };

        useEffect(() => {
                if (visible && showFullNutrition) {
                        fetchFullNutrition();
                }
        }, [visible, showFullNutrition]);
        useEffect(() => {
                if (visible) {
                        setServingSize(food.quantityGrams !== undefined ? food.quantityGrams.toString() : '100');
                }
        }, [food, visible]);

        const handleSubmit = async () => {
                if (!isValidServingSize) return; // Prevent adding if invalid
                const date = new Date(selectedDate || new Date());
                date.setHours(0, 0, 0, 0);
                try {
                        if (mode === 'update' && typeof mealIndex === 'number') {
                                await updateMealEntry(date.toISOString(), selectedMealType, mealIndex, {
                                        quantityGrams: servingSizeNum,
                                        timestamp: new Date().toISOString(),
                                });
                                onUpdated && onUpdated({ quantityGrams: servingSizeNum });
                        } else {
                                await addMealEntry(date.toISOString(), selectedMealType, {
                                        code: food.code,
                                        name: food.name,
                                        brand: food.brand,
                                        imageUrl: food.imageUrl,
                                        calories: food.calories,
                                        protein: food.protein,
                                        carbs: food.carbs,
                                        fat: food.fat,
                                        fiber: food.fiber,
                                        quantityGrams: servingSizeNum,
                                        timestamp: new Date().toISOString(),
                                });
                        }
                } catch (e) {}
                onClose();
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
                                <View className="relative h-64">
                                        {/* Food Image */}
                                        {food.imageUrl ? (
                                                <Image
                                                        source={{ uri: food.imageUrl }}
                                                        style={{ width: '100%', height: '100%' }}
                                                        resizeMode="cover"
                                                />
                                        ) : (
                                                <Image
                                                        source={require('../../../assets/images/logo.png')}
                                                        style={{ width: '100%', height: '100%' }}
                                                        resizeMode="cover"
                                                />
                                        )}
                                        <View className="absolute inset-0 bg-black/40" />

                                        {/* Header Icons - Layout like FoodSearchModal */}
                                        <View className="absolute left-4 right-4 top-4 w-full flex-row items-center justify-between">
                                                {/* Back Button */}
                                                <TouchableOpacity
                                                        onPress={onClose}
                                                        className="size-10 items-center justify-center rounded-full bg-black/50"
                                                        activeOpacity={0.7}
                                                >
                                                        <ChevronLeft size={24} color={COLORS.ICON_LIGHT} />
                                                </TouchableOpacity>

                                                {/* Meal Dropdown - Center */}
                                                <Pressable
                                                        onPress={() => setShowMealDropdown(!showMealDropdown)}
                                                        className="flex-row items-center gap-1 rounded-lg px-3 py-2"
                                                >
                                                        <CText size="lg" weight="semibold" className="text-white">
                                                                {selectedMeal?.label}
                                                        </CText>
                                                        <ChevronDown
                                                                size={16}
                                                                color={COLORS.ICON_LIGHT}
                                                                style={{
                                                                        transform: [
                                                                                {
                                                                                        rotate: showMealDropdown
                                                                                                ? '180deg'
                                                                                                : '0deg',
                                                                                },
                                                                        ],
                                                                }}
                                                        />
                                                </Pressable>

                                                {/* Favorite Icon - Right */}
                                                <TouchableOpacity
                                                        className="size-10 items-center justify-center rounded-full bg-black/50"
                                                        activeOpacity={0.7}
                                                >
                                                        <Heart size={20} color={COLORS.ERROR} fill="transparent" />
                                                </TouchableOpacity>
                                        </View>

                                        {/* Food Name */}
                                        <View className="absolute bottom-4 left-4 right-4">
                                                <View className="flex-row items-center gap-2">
                                                        <CText size="xl" weight="bold" className="text-white">
                                                                {food.name}
                                                        </CText>
                                                        <Check size={18} color={COLORS.SUCCESS} />
                                                </View>

                                                {/* Source Info */}
                                                <View className="mt-1 flex-row items-center gap-1">
                                                        <Info size={14} color={COLORS.TEXT_SECONDARY_DARK} />
                                                        <CText size="sm" className="text-white/80">
                                                                Data from Open Food Facts
                                                        </CText>
                                                </View>
                                        </View>
                                </View>

                                {/* Meal Dropdown */}
                                {showMealDropdown && (
                                        <Modal
                                                visible
                                                transparent
                                                animationType="fade"
                                                onRequestClose={() => setShowMealDropdown(false)}
                                        >
                                                <TouchableOpacity
                                                        className="flex-1 items-center justify-center bg-black/50"
                                                        activeOpacity={1}
                                                        onPress={() => setShowMealDropdown(false)}
                                                >
                                                        <TouchableOpacity
                                                                className="w-full max-w-xs rounded-2xl bg-surfacePrimary px-2 py-4 dark:bg-surfacePrimary-dark"
                                                                activeOpacity={1}
                                                                onPress={(e) => e.stopPropagation()}
                                                        >
                                                                {MEAL_OPTIONS.map((meal) => (
                                                                        <TouchableOpacity
                                                                                key={meal.key}
                                                                                onPress={() => {
                                                                                        setSelectedMealType(meal.key);
                                                                                        setShowMealDropdown(false);
                                                                                }}
                                                                                className={`flex-row items-center justify-between rounded-lg px-2 py-3 ${
                                                                                        selectedMealType === meal.key
                                                                                                ? 'bg-primary'
                                                                                                : ''
                                                                                }`}
                                                                        >
                                                                                <CText
                                                                                        weight={
                                                                                                selectedMealType ===
                                                                                                meal.key
                                                                                                        ? 'medium'
                                                                                                        : 'normal'
                                                                                        }
                                                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                                                >
                                                                                        {meal.label}
                                                                                </CText>
                                                                                {selectedMealType === meal.key && (
                                                                                        <Check
                                                                                                size={18}
                                                                                                color={
                                                                                                        COLORS.BACKGROUND_LIGHT
                                                                                                }
                                                                                        />
                                                                                )}
                                                                        </TouchableOpacity>
                                                                ))}
                                                        </TouchableOpacity>
                                                </TouchableOpacity>
                                        </Modal>
                                )}

                                <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
                                        {/* Serving Size */}
                                        <View className="mb-4 mt-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                                <CText
                                                        weight="semibold"
                                                        className="mb-3 text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        Serving size
                                                </CText>
                                                <View className="flex-row items-center gap-2">
                                                        <View className="flex-1 rounded-l-xl bg-surfaceSecondary px-4 dark:bg-surfaceSecondary-dark">
                                                                <TextInput
                                                                        value={servingSize}
                                                                        onChangeText={(text) => {
                                                                                // Allow empty string or numbers only
                                                                                if (text === '' || /^\d+$/.test(text)) {
                                                                                        setServingSize(text);
                                                                                }
                                                                        }}
                                                                        keyboardType="numeric"
                                                                        placeholder="100"
                                                                        placeholderTextColor={
                                                                                isDark
                                                                                        ? COLORS.TEXT_SECONDARY_DARK
                                                                                        : COLORS.TEXT_SECONDARY_LIGHT
                                                                        }
                                                                        className="text-base text-textPrimary dark:text-textPrimary-dark"
                                                                        style={{ fontFamily: 'SpaceGrotesk-Regular' }}
                                                                />
                                                        </View>
                                                        <View className="rounded-r-xl bg-surfaceSecondary px-4 py-3 dark:bg-surfaceSecondary-dark">
                                                                <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                        gram
                                                                </CText>
                                                        </View>
                                                </View>
                                        </View>

                                        {/* Nutritional Value */}
                                        <View className="mb-4 rounded-xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                                <CText
                                                        weight="semibold"
                                                        className="mb-3 text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        Nutritional value
                                                </CText>

                                                <View className="flex-row items-center justify-between">
                                                        {/* Circular Progress */}
                                                        <CircularProgress
                                                                progress={progressPercent}
                                                                size={120}
                                                                strokeWidth={12}
                                                                color={COLORS.PRIMARY}
                                                                backgroundColor={COLORS.BACKGROUND_GRAY_LIGHT}
                                                        >
                                                                <View className="items-center">
                                                                        <CText
                                                                                size="2xl"
                                                                                weight="bold"
                                                                                className="!text-warning"
                                                                        >
                                                                                {calories}
                                                                        </CText>
                                                                        <CText
                                                                                size="sm"
                                                                                className="text-textSecondary dark:text-textSecondary-dark"
                                                                        >
                                                                                Kcal
                                                                        </CText>
                                                                </View>
                                                        </CircularProgress>

                                                        {/* Macronutrients */}
                                                        <View className="flex-1 gap-2 pl-4">
                                                                <View className="flex-row items-center gap-2">
                                                                        <Wheat size={16} color={COLORS.WARNING} />
                                                                        <CText className="flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Carbs: {carbs.toFixed(1)}g
                                                                        </CText>
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                {carbsPercent.toFixed(0)}%
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row items-center gap-2">
                                                                        <Beef size={16} color={COLORS.ERROR} />
                                                                        <CText className="flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Protein: {protein.toFixed(1)}g
                                                                        </CText>
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                {proteinPercent.toFixed(0)}%
                                                                        </CText>
                                                                </View>
                                                                <View className="flex-row items-center gap-2">
                                                                        <Droplet size={16} color={COLORS.INFO} />
                                                                        <CText className="flex-1 text-textPrimary dark:text-textPrimary-dark">
                                                                                Fat: {fat.toFixed(1)}g
                                                                        </CText>
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                {fatPercent.toFixed(0)}%
                                                                        </CText>
                                                                </View>
                                                        </View>
                                                </View>

                                                {/* View Full Nutrition Button */}
                                                <TouchableOpacity
                                                        onPress={() => setShowFullNutrition(!showFullNutrition)}
                                                        className="mt-4 flex-row items-center justify-center"
                                                        activeOpacity={0.7}
                                                >
                                                        <CText weight="medium" className="!text-primary">
                                                                View full nutritional information
                                                        </CText>
                                                        {showFullNutrition ? (
                                                                <ChevronUp size={18} color={COLORS.PRIMARY} />
                                                        ) : (
                                                                <ChevronDown size={18} color={COLORS.PRIMARY} />
                                                        )}
                                                </TouchableOpacity>

                                                {/* Full Nutrition Details */}
                                                {showFullNutrition && (
                                                        <View className="mt-3">
                                                                {loadingNutrition ? (
                                                                        <ActivityIndicator
                                                                                size="large"
                                                                                color={COLORS.PRIMARY}
                                                                        />
                                                                ) : fullNutritionData?.nutriments ? (
                                                                        <View className="gap-2">
                                                                                {/* Full nutrition list */}
                                                                                <NutritionRow
                                                                                        label="Water"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'water_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="g"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Protein"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'proteins_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="g"
                                                                                />
                                                                                <View className="ml-4 gap-1">
                                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                                Carbohydrate
                                                                                        </CText>
                                                                                        <NutritionRow
                                                                                                label="Total sugar"
                                                                                                value={
                                                                                                        fullNutritionData
                                                                                                                .nutriments[
                                                                                                                'sugars_100g'
                                                                                                        ] || '-'
                                                                                                }
                                                                                                unit="g"
                                                                                                indent
                                                                                        />
                                                                                        <NutritionRow
                                                                                                label="Added sugar"
                                                                                                value={
                                                                                                        fullNutritionData
                                                                                                                .nutriments[
                                                                                                                'added-sugars_100g'
                                                                                                        ] || '-'
                                                                                                }
                                                                                                unit="g"
                                                                                                indent
                                                                                        />
                                                                                        <NutritionRow
                                                                                                label="Fiber"
                                                                                                value={
                                                                                                        fullNutritionData
                                                                                                                .nutriments[
                                                                                                                'fiber_100g'
                                                                                                        ] || '-'
                                                                                                }
                                                                                                unit="g"
                                                                                                indent
                                                                                        />
                                                                                </View>
                                                                                <View className="ml-4 gap-1">
                                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                                Fat
                                                                                        </CText>
                                                                                        <NutritionRow
                                                                                                label="Saturated fat"
                                                                                                value={
                                                                                                        fullNutritionData
                                                                                                                .nutriments[
                                                                                                                'saturated-fat_100g'
                                                                                                        ] || '-'
                                                                                                }
                                                                                                unit="g"
                                                                                                indent
                                                                                        />
                                                                                        <NutritionRow
                                                                                                label="Trans fat"
                                                                                                value={
                                                                                                        fullNutritionData
                                                                                                                .nutriments[
                                                                                                                'trans-fat_100g'
                                                                                                        ] || '-'
                                                                                                }
                                                                                                unit="g"
                                                                                                indent
                                                                                        />
                                                                                </View>
                                                                                <NutritionRow
                                                                                        label="Calcium"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'calcium_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="mg"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Potassium"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'potassium_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="mg"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Magnesium"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'magnesium_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="mg"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Sodium"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'sodium_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="mg"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Iron"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'iron_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="mg"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Vitamin A"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'vitamin-a_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="µg"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Vitamin C"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'vitamin-c_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="mg"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Vitamin D"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'vitamin-d_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="µg"
                                                                                />
                                                                                <NutritionRow
                                                                                        label="Vitamin E"
                                                                                        value={
                                                                                                fullNutritionData
                                                                                                        .nutriments[
                                                                                                        'vitamin-e_100g'
                                                                                                ] || '-'
                                                                                        }
                                                                                        unit="mg"
                                                                                />
                                                                        </View>
                                                                ) : (
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                No detailed nutrition data available
                                                                        </CText>
                                                                )}

                                                                {/* Warning Box */}
                                                                <TouchableOpacity
                                                                        className="mt-3 flex-row items-center gap-3 rounded-xl bg-status-warning p-3"
                                                                        activeOpacity={0.7}
                                                                >
                                                                        <View className="size-6 rounded-full bg-status-warning" />
                                                                        <CText
                                                                                size="sm"
                                                                                className="flex-1 text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                If the data is incorrect, please report
                                                                                so we can fix it
                                                                        </CText>
                                                                        <ChevronRight
                                                                                size={18}
                                                                                color={COLORS.TEXT_PRIMARY_DARK}
                                                                        />
                                                                </TouchableOpacity>

                                                                {/* Collapse Button */}
                                                                <TouchableOpacity
                                                                        onPress={() => setShowFullNutrition(false)}
                                                                        className="mt-2 flex-row items-center justify-center"
                                                                        activeOpacity={0.7}
                                                                >
                                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                                Collapse
                                                                        </CText>
                                                                        <ChevronUp
                                                                                size={16}
                                                                                color={
                                                                                        isDark
                                                                                                ? COLORS.TEXT_SECONDARY_DARK
                                                                                                : COLORS.TEXT_SECONDARY_LIGHT
                                                                                }
                                                                        />
                                                                </TouchableOpacity>
                                                        </View>
                                                )}
                                        </View>
                                </ScrollView>

                                {/* Submit Button */}
                                <View className="border-t border-textSecondary/10 px-4 pb-4 pt-3 dark:border-textSecondary/20">
                                        <TouchableOpacity
                                                onPress={handleSubmit}
                                                disabled={!isValidServingSize}
                                                className={`rounded-xl px-6 py-4 ${
                                                        isValidServingSize
                                                                ? 'bg-primary'
                                                                : 'bg-surfacePrimary dark:bg-surfacePrimary-dark'
                                                }`}
                                                activeOpacity={isValidServingSize ? 0.8 : 1}
                                        >
                                                <CText
                                                        weight="bold"
                                                        className={`text-center text-lg ${
                                                                isValidServingSize
                                                                        ? '!text-white'
                                                                        : 'text-textSecondary dark:text-textSecondary-dark'
                                                        }`}
                                                >
                                                        {mode === 'update'
                                                                ? 'Update'
                                                                : `Add to ${selectedMeal?.label.toLowerCase()}`}
                                                </CText>
                                        </TouchableOpacity>
                                </View>
                        </SafeAreaView>
                </Modal>
        );
};

// Helper component for nutrition rows
const NutritionRow: React.FC<{
        label: string;
        value: number | string;
        unit: string;
        indent?: boolean;
}> = ({ label, value, unit, indent = false }) => {
        const displayValue = typeof value === 'number' ? value.toFixed(2) : value === '-' ? '-' : value;
        return (
                <View className={`flex-row items-center justify-between ${indent ? 'ml-4' : ''}`}>
                        <CText className="text-textPrimary dark:text-textPrimary-dark">{label}</CText>
                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                {displayValue} {displayValue !== '-' && unit}
                        </CText>
                </View>
        );
};
