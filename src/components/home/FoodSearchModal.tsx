import React, { useState, useEffect, useCallback } from 'react';
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
        Search,
        X,
        Plus,
        Check,
        Beef,
        Wheat,
        Droplet,
        HandPlatter,
} from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import { CText } from '../ui/CText';
import { useTheme } from '../../contexts';
import { COLORS } from '../../style/color';
import { CameraView } from '../CameraView';
import { fetchProductByBarcode, parseOpenFoodFactsData } from '../../services/api/foodApi';
import { useDiaryStore } from '../../store/diaryStore';
import { FoodDetailModal } from './FoodDetailModal';
import { Flame, Sprout } from 'lucide-react-native';

type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealOption {
        key: MealKey;
        label: string;
        labelVi: string;
}

export const MEAL_OPTIONS: MealOption[] = [
        { key: 'breakfast', label: 'Breakfast', labelVi: 'Sáng' },
        { key: 'lunch', label: 'Lunch', labelVi: 'Trưa' },
        { key: 'dinner', label: 'Dinner', labelVi: 'Tối' },
        { key: 'snack', label: 'Snack', labelVi: 'Phụ' },
];

interface OpenFoodFactsSearchResult {
        code: string;
        product?: {
                product_name?: string;
                brands?: string;
                image_url?: string;
                image_front_url?: string;
                image_front_small_url?: string;
                nutriments?: {
                        'energy-kcal_100g'?: number;
                        'energy-kcal'?: number;
                        proteins_100g?: number;
                        proteins?: number;
                        carbohydrates_100g?: number;
                        carbohydrates?: number;
                        fat_100g?: number;
                        fat?: number;
                        fiber_100g?: number;
                        fiber?: number;
                };
        };
}

interface OpenFoodFactsSearchResponse {
        products?: OpenFoodFactsSearchResult[];
        count?: number;
        page?: number;
        page_size?: number;
        page_count?: number;
}

interface FoodSearchResult {
        code: string;
        name: string;
        brand?: string;
        imageUrl?: string;
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        fiber?: number;
}

interface FoodSearchModalProps {
        visible: boolean;
        onClose: () => void;
        initialMealType?: MealKey;
        onSelectFood?: (food: FoodSearchResult, mealType: MealKey) => void;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
        visible,
        onClose,
        initialMealType = 'breakfast',
        onSelectFood,
}) => {
        const { isDark } = useTheme();
        const [searchQuery, setSearchQuery] = useState('');
        const [selectedMealType, setSelectedMealType] = useState<MealKey>(initialMealType);
        const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
        const [isSearching, setIsSearching] = useState(false);
        const [selectedFilter, setSelectedFilter] = useState<'all' | 'high-protein' | 'low-carb' | 'low-fat'>('all');
        const [showMealDropdown, setShowMealDropdown] = useState(false);
        const [showScanner, setShowScanner] = useState(false);
        const [showSummary, setShowSummary] = useState(false);
        const [summaryTab, setSummaryTab] = useState<MealKey>('breakfast');
        const [countryTag, setCountryTag] = useState<string | null>(null);
        const countForSelected = useDiaryStore((s) => s.getCount(selectedMealType));
        const addEntry = useDiaryStore((s) => s.addEntry);
        const removeEntryFromStore = useDiaryStore((s) => s.removeEntry);
        const itemsForTab = useDiaryStore((s) => s.mealLogs[summaryTab] || []);
        const totalsForTab = useDiaryStore((s) => s.getTotals(summaryTab));
        const [showDetailModal, setShowDetailModal] = useState(false);
        const [selectedFoodForDetail, setSelectedFoodForDetail] = useState<FoodSearchResult | null>(null);

        // Update selectedMealType when initialMealType changes or modal opens
        useEffect(() => {
                if (visible) {
                        setSelectedMealType(initialMealType);
                }
        }, [initialMealType, visible]);

        // Update summaryTab when summary modal opens to match selectedMealType
        useEffect(() => {
                if (showSummary) {
                        setSummaryTab(selectedMealType);
                }
        }, [showSummary, selectedMealType]);

        // Resolve device country to OpenFoodFacts country tag (lowercase English name)
        useEffect(() => {
                const resolveCountryTag = () => {
                        try {
                                const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
                                // Try to extract region like en-FI, vi-VN
                                const match = locale.match(/-([A-Z]{2})$/);
                                const region = match?.[1]?.toUpperCase();
                                // Minimal mapping (extend as needed)
                                const REGION_TO_OFF: Record<string, string> = {
                                        FI: 'finland',
                                        VN: 'vietnam',
                                        US: 'united-states',
                                        GB: 'united-kingdom',
                                        SE: 'sweden',
                                        NO: 'norway',
                                        DK: 'denmark',
                                        DE: 'germany',
                                        FR: 'france',
                                };
                                if (region && REGION_TO_OFF[region]) {
                                        setCountryTag(REGION_TO_OFF[region]);
                                }
                        } catch {}
                };
                resolveCountryTag();
        }, []);

        // Search function for Open Food Facts
        const searchOpenFoodFacts = useCallback(async (query: string): Promise<FoodSearchResult[]> => {
                if (!query.trim()) return [];

                try {
                        // Don't double encode - the API handles encoding
                        const searchTerms = query.trim().replace(/\s+/g, ' ');
                        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerms)}&json=true&fields=code,product_name,brands,image_url,image_front_url,image_front_small_url,nutriments&countries_tags=finland`;
                        console.log('url', url);
                        const response = await fetch(url, {
                                headers: {
                                        Accept: 'application/json',
                                },
                        });

                        if (!response.ok) {
                                console.error('Open Food Facts API error:', response.status, response.statusText);
                                return [];
                        }

                        const data = (await response.json()) as OpenFoodFactsSearchResponse;

                        if (!data.products || data.products.length === 0) {
                                console.log('No products found for query:', query);
                                return [];
                        }

                        return data.products
                                .filter((product: any) => {
                                        const p = (product as any).product ?? product;
                                        return !!p?.product_name;
                                })
                                .map((product: any) => {
                                        const p = (product as any).product ?? product;
                                        const nutriments = p.nutriments || {};
                                        return {
                                                code: product.code,
                                                name: p.product_name || 'Unknown',
                                                brand: p.brands,
                                                imageUrl:
                                                        p.image_front_url ||
                                                        p.image_url ||
                                                        p.image_front_small_url ||
                                                        undefined,
                                                calories:
                                                        nutriments['energy-kcal_100g'] ||
                                                        nutriments['energy-kcal'] ||
                                                        0,
                                                protein: nutriments.proteins_100g || nutriments.proteins || 0,
                                                carbs: nutriments.carbohydrates_100g || nutriments.carbohydrates || 0,
                                                fat: nutriments.fat_100g || nutriments.fat || 0,
                                                fiber: nutriments['fiber_100g'] || nutriments.fiber || 0,
                                        };
                                });
                } catch (error) {
                        console.error('Error searching Open Food Facts:', error);
                        return [];
                }
        }, []);
        // Debounced search
        useEffect(() => {
                if (!visible) {
                        setSearchQuery('');
                        setSearchResults([]);
                        return;
                }

                const timeoutId = setTimeout(async () => {
                        if (searchQuery.trim()) {
                                setIsSearching(true);
                                const results = await searchOpenFoodFacts(searchQuery);

                                // Apply filters
                                let filteredResults = results;
                                if (selectedFilter === 'high-protein') {
                                        filteredResults = results.filter((r) => (r.protein || 0) >= 10);
                                } else if (selectedFilter === 'low-carb') {
                                        filteredResults = results.filter((r) => (r.carbs || 0) <= 10);
                                } else if (selectedFilter === 'low-fat') {
                                        filteredResults = results.filter((r) => (r.fat || 0) <= 5);
                                }

                                setSearchResults(filteredResults);
                                setIsSearching(false);
                        } else {
                                setSearchResults([]);
                                setIsSearching(false);
                        }
                }, 500);

                return () => clearTimeout(timeoutId);
        }, [searchQuery, visible, selectedFilter, searchOpenFoodFacts]);

        const selectedMeal = MEAL_OPTIONS.find((m) => m.key === selectedMealType);

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

                                        <Pressable
                                                onPress={() => setShowMealDropdown(!showMealDropdown)}
                                                className="flex-row items-center gap-1 rounded-lg px-3 py-2"
                                        >
                                                <CText
                                                        size="lg"
                                                        weight="semibold"
                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        {selectedMeal?.label}
                                                </CText>
                                                <ChevronDown
                                                        size={16}
                                                        color={isDark ? COLORS.ICON_LIGHT : COLORS.ICON_DARK}
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

                                        <TouchableOpacity onPress={() => setShowSummary(true)} activeOpacity={0.7}>
                                                <View className="relative">
                                                        <HandPlatter
                                                                size={24}
                                                                color={isDark ? COLORS.ICON_LIGHT : COLORS.ICON_DARK}
                                                        />
                                                        {countForSelected > 0 && (
                                                                <View className="absolute -right-2 -top-2 min-w-4 items-center justify-center rounded-full bg-primary px-1">
                                                                        <CText
                                                                                size="xs"
                                                                                weight="bold"
                                                                                className="!text-white"
                                                                        >
                                                                                {countForSelected}
                                                                        </CText>
                                                                </View>
                                                        )}
                                                </View>
                                        </TouchableOpacity>
                                </View>

                                {/* Meal Type Dropdown Modal */}
                                <Modal
                                        visible={showMealDropdown}
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
                                                                                        selectedMealType === meal.key
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
                                                                                        color={COLORS.BACKGROUND_LIGHT}
                                                                                />
                                                                        )}
                                                                </TouchableOpacity>
                                                        ))}
                                                </TouchableOpacity>
                                        </TouchableOpacity>
                                </Modal>

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
                                                                placeholder="Search for food"
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

                                                {/* Scan Button with Lottie */}
                                                <TouchableOpacity
                                                        className="size-12 items-center justify-center rounded-xl bg-primary"
                                                        activeOpacity={0.8}
                                                        onPress={() => setShowScanner(true)}
                                                >
                                                        <LottieView
                                                                source={require('../../assets/images/scan.json')}
                                                                autoPlay
                                                                loop
                                                                colorFilters={[
                                                                        {
                                                                                keypath: 'Outer shape.Shapes.Stroke 1',
                                                                                color: COLORS.ICON_LIGHT,
                                                                        },
                                                                        {
                                                                                keypath: 'Scanner.Shapes.Stroke 1',
                                                                                color: COLORS.ICON_LIGHT,
                                                                        },
                                                                ]}
                                                                style={{ width: 48, height: 48 }}
                                                        />
                                                </TouchableOpacity>
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
                                                        <View className="size-32 overflow-hidden rounded-full">
                                                                <Image
                                                                        source={require('../../assets/images/not_found.jpeg')}
                                                                        className="size-32"
                                                                        resizeMode="cover"
                                                                />
                                                        </View>
                                                        <CText
                                                                size="lg"
                                                                weight="medium"
                                                                className="mt-4 text-center text-textPrimary dark:text-textPrimary-dark"
                                                        >
                                                                No suitable food or product found
                                                        </CText>
                                                </View>
                                        ) : searchQuery.trim() === '' ? (
                                                <View className="py-4">
                                                        <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                Recent searches
                                                        </CText>
                                                </View>
                                        ) : (
                                                <View className="gap-2">
                                                        {searchResults.map((food) => (
                                                                <View
                                                                        key={food.code}
                                                                        className="flex-row items-center gap-3 rounded-xl bg-surfacePrimary p-3 dark:bg-surfacePrimary-dark"
                                                                >
                                                                        <TouchableOpacity
                                                                                onPress={() => {
                                                                                        setSelectedFoodForDetail(food);
                                                                                        setShowDetailModal(true);
                                                                                }}
                                                                                className="flex-1 flex-row items-center gap-3"
                                                                                activeOpacity={0.7}
                                                                        >
                                                                                {/* Circular Image */}
                                                                                <View className="size-16 overflow-hidden rounded-full">
                                                                                        {food.imageUrl ? (
                                                                                                <Image
                                                                                                        source={{
                                                                                                                uri: food.imageUrl,
                                                                                                        }}
                                                                                                        className="size-16"
                                                                                                        resizeMode="cover"
                                                                                                />
                                                                                        ) : (
                                                                                                <Image
                                                                                                        source={require('../../assets/images/not_found.jpeg')}
                                                                                                        className="size-16"
                                                                                                        resizeMode="cover"
                                                                                                />
                                                                                        )}
                                                                                </View>

                                                                                {/* Food Info */}
                                                                                <View className="flex-1">
                                                                                        <CText
                                                                                                weight="medium"
                                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                                                numberOfLines={1}
                                                                                        >
                                                                                                {food.name}
                                                                                        </CText>
                                                                                        {food.brand && (
                                                                                                <CText
                                                                                                        size="sm"
                                                                                                        className="mt-1 text-textSecondary dark:text-textSecondary-dark"
                                                                                                >
                                                                                                        {food.brand}
                                                                                                </CText>
                                                                                        )}
                                                                                        <CText
                                                                                                size="sm"
                                                                                                className="mt-1 text-textSecondary dark:text-textSecondary-dark"
                                                                                        >
                                                                                                {food.calories
                                                                                                        ? `${food.calories} kcal`
                                                                                                        : 'N/A'}{' '}
                                                                                                • 100g
                                                                                        </CText>
                                                                                </View>
                                                                        </TouchableOpacity>

                                                                        {/* Add Button */}
                                                                        <TouchableOpacity
                                                                                className="size-10 items-center justify-center rounded-full bg-primary"
                                                                                activeOpacity={0.7}
                                                                                onPress={() => {
                                                                                        // Add directly to diary
                                                                                        addEntry(selectedMealType, {
                                                                                                code: food.code,
                                                                                                name: food.name,
                                                                                                calories: food.calories,
                                                                                                protein: food.protein,
                                                                                                carbs: food.carbs,
                                                                                                fat: food.fat,
                                                                                                fiber: food.fiber,
                                                                                                imageUrl: food.imageUrl,
                                                                                                brand: food.brand,
                                                                                        });
                                                                                }}
                                                                        >
                                                                                <Plus
                                                                                        size={20}
                                                                                        color="#fff"
                                                                                        strokeWidth={2}
                                                                                />
                                                                        </TouchableOpacity>
                                                                </View>
                                                        ))}
                                                </View>
                                        )}
                                </ScrollView>

                                {/* Summary Modal */}
                                {showSummary && (
                                        <Modal
                                                visible
                                                transparent
                                                animationType="fade"
                                                onRequestClose={() => setShowSummary(false)}
                                        >
                                                <View className="flex-1 bg-black/60">
                                                        <SafeAreaView className="mt-auto rounded-t-3xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                                                <View className="mb-3 flex-row items-center justify-between">
                                                                        <CText
                                                                                size="lg"
                                                                                weight="bold"
                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                        >
                                                                                Your meals
                                                                        </CText>
                                                                        <TouchableOpacity
                                                                                onPress={() => setShowSummary(false)}
                                                                        >
                                                                                <X
                                                                                        size={22}
                                                                                        color={
                                                                                                isDark
                                                                                                        ? COLORS.ICON_LIGHT
                                                                                                        : COLORS.ICON_DARK
                                                                                        }
                                                                                />
                                                                        </TouchableOpacity>
                                                                </View>
                                                                {/* Tabs */}
                                                                <View className="mb-3 flex-row items-center justify-between gap-2">
                                                                        {(
                                                                                [
                                                                                        'breakfast',
                                                                                        'lunch',
                                                                                        'dinner',
                                                                                        'snack',
                                                                                ] as MealKey[]
                                                                        ).map((t) => (
                                                                                <TouchableOpacity
                                                                                        key={t}
                                                                                        onPress={() => setSummaryTab(t)}
                                                                                        className={`flex-1 items-center rounded-full px-3 py-2 ${summaryTab === t ? 'bg-primary' : 'bg-surfaceSecondary dark:bg-surfaceSecondary-dark'}`}
                                                                                >
                                                                                        <CText
                                                                                                weight="medium"
                                                                                                className={`${summaryTab === t ? '!text-white' : 'text-textSecondary dark:text-textSecondary-dark'} capitalize`}
                                                                                        >
                                                                                                {t}
                                                                                        </CText>
                                                                                </TouchableOpacity>
                                                                        ))}
                                                                </View>

                                                                {/* Items for selected tab */}
                                                                <ScrollView className="max-h-[60%]">
                                                                        {(() => {
                                                                                const items = itemsForTab;
                                                                                return items.length === 0 ? (
                                                                                        <CText
                                                                                                size="lg"
                                                                                                weight="medium"
                                                                                                className="pt-4 text-center text-textSecondary dark:text-textSecondary-dark"
                                                                                        >
                                                                                                No items
                                                                                        </CText>
                                                                                ) : (
                                                                                        <View>
                                                                                                {items.map((it) => (
                                                                                                        <View
                                                                                                                key={
                                                                                                                        it.id
                                                                                                                }
                                                                                                                className="mb-2 flex-row items-center gap-3 rounded-xl bg-surfaceSecondary p-3 dark:bg-surfaceSecondary-dark"
                                                                                                        >
                                                                                                                <View className="size-12 overflow-hidden rounded-full bg-background">
                                                                                                                        {it.imageUrl ? (
                                                                                                                                <Image
                                                                                                                                        source={{
                                                                                                                                                uri: it.imageUrl,
                                                                                                                                        }}
                                                                                                                                        className="size-12"
                                                                                                                                />
                                                                                                                        ) : (
                                                                                                                                <Image
                                                                                                                                        source={require('../../assets/images/not_found.jpeg')}
                                                                                                                                        className="size-12"
                                                                                                                                />
                                                                                                                        )}
                                                                                                                </View>
                                                                                                                <View className="flex-1">
                                                                                                                        <CText
                                                                                                                                weight="medium"
                                                                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                                                                                numberOfLines={
                                                                                                                                        1
                                                                                                                                }
                                                                                                                        >
                                                                                                                                {
                                                                                                                                        it.name
                                                                                                                                }
                                                                                                                        </CText>
                                                                                                                        <CText
                                                                                                                                size="sm"
                                                                                                                                className="mt-1 text-textSecondary dark:text-textSecondary-dark"
                                                                                                                        >
                                                                                                                                {it.quantityGrams ??
                                                                                                                                        100}{' '}
                                                                                                                                g
                                                                                                                                •{' '}
                                                                                                                                {Math.round(
                                                                                                                                        (it.calories ??
                                                                                                                                                0) *
                                                                                                                                                ((it.quantityGrams ??
                                                                                                                                                        100) /
                                                                                                                                                        100),
                                                                                                                                )}{' '}
                                                                                                                                kcal
                                                                                                                        </CText>
                                                                                                                </View>
                                                                                                                <TouchableOpacity
                                                                                                                        onPress={() =>
                                                                                                                                removeEntryFromStore(
                                                                                                                                        summaryTab,
                                                                                                                                        it.id,
                                                                                                                                )
                                                                                                                        }
                                                                                                                        className="bg-error size-8 items-center justify-center rounded-full"
                                                                                                                >
                                                                                                                        <X
                                                                                                                                size={
                                                                                                                                        14
                                                                                                                                }
                                                                                                                                color="#fff"
                                                                                                                        />
                                                                                                                </TouchableOpacity>
                                                                                                        </View>
                                                                                                ))}
                                                                                        </View>
                                                                                );
                                                                        })()}
                                                                </ScrollView>

                                                                {/* Totals */}
                                                                {(() => {
                                                                        const totals = totalsForTab;
                                                                        return (
                                                                                <View className="mt-3">
                                                                                        <View className="mb-2 flex-row items-center justify-between">
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
                                                                                        <View className="flex-row items-center justify-between gap-2">
                                                                                                <View className="flex-1 flex-row items-center gap-2 rounded-full bg-primary/20 px-3 py-2">
                                                                                                        <Wheat
                                                                                                                size={
                                                                                                                        16
                                                                                                                }
                                                                                                                color={
                                                                                                                        COLORS.PRIMARY
                                                                                                                }
                                                                                                        />
                                                                                                        <CText
                                                                                                                weight="medium"
                                                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                                                        >
                                                                                                                {Math.round(
                                                                                                                        totals.carbs,
                                                                                                                )}{' '}
                                                                                                                g
                                                                                                        </CText>
                                                                                                </View>
                                                                                                <View className="bg-error/20 flex-1 flex-row items-center gap-2 rounded-full px-3 py-2">
                                                                                                        <Beef
                                                                                                                size={
                                                                                                                        16
                                                                                                                }
                                                                                                                color={
                                                                                                                        COLORS.ERROR
                                                                                                                }
                                                                                                        />
                                                                                                        <CText
                                                                                                                weight="medium"
                                                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                                                        >
                                                                                                                {Math.round(
                                                                                                                        totals.protein,
                                                                                                                )}{' '}
                                                                                                                g
                                                                                                        </CText>
                                                                                                </View>
                                                                                                <View className="bg-warning/20 flex-1 flex-row items-center gap-2 rounded-full px-3 py-2">
                                                                                                        <Droplet
                                                                                                                size={
                                                                                                                        16
                                                                                                                }
                                                                                                                color={
                                                                                                                        COLORS.WARNING
                                                                                                                }
                                                                                                        />
                                                                                                        <CText
                                                                                                                weight="medium"
                                                                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                                                                        >
                                                                                                                {Math.round(
                                                                                                                        totals.fat,
                                                                                                                )}{' '}
                                                                                                                g
                                                                                                        </CText>
                                                                                                </View>
                                                                                        </View>

                                                                                        {/* Save Food Diary Button */}
                                                                                        <TouchableOpacity
                                                                                                onPress={() => {
                                                                                                        // Close summary modal after saving
                                                                                                        setShowSummary(
                                                                                                                false,
                                                                                                        );
                                                                                                }}
                                                                                                className="mt-4 rounded-xl bg-primary px-6 py-4"
                                                                                                activeOpacity={0.8}
                                                                                        >
                                                                                                <CText
                                                                                                        weight="bold"
                                                                                                        className="text-center text-base !text-white"
                                                                                                >
                                                                                                        Save food diary
                                                                                                </CText>
                                                                                        </TouchableOpacity>
                                                                                </View>
                                                                        );
                                                                })()}
                                                        </SafeAreaView>
                                                </View>
                                        </Modal>
                                )}

                                {/* Scanner Overlay */}
                                {showScanner && (
                                        <Modal
                                                visible
                                                transparent
                                                animationType="fade"
                                                onRequestClose={() => setShowScanner(false)}
                                        >
                                                <View className="flex-1 bg-black/90">
                                                        <CameraView
                                                                onClose={() => setShowScanner(false)}
                                                                onBarcodeScanned={async (code) => {
                                                                        try {
                                                                                const product =
                                                                                        await fetchProductByBarcode(
                                                                                                code,
                                                                                        );
                                                                                const parsed = product
                                                                                        ? parseOpenFoodFactsData(
                                                                                                  product,
                                                                                          )
                                                                                        : null;
                                                                                if (parsed) {
                                                                                        const mapped = {
                                                                                                code: parsed.barcode,
                                                                                                name: parsed.foodName,
                                                                                                brand: parsed.brand,
                                                                                                imageUrl: parsed.imageUrl,
                                                                                                calories: parsed
                                                                                                        .nutrients
                                                                                                        .calories,
                                                                                                protein: parsed
                                                                                                        .nutrients
                                                                                                        .protein,
                                                                                                carbs: parsed.nutrients
                                                                                                        .carbs,
                                                                                                fat: parsed.nutrients
                                                                                                        .fat,
                                                                                                fiber: parsed.nutrients
                                                                                                        .fiber,
                                                                                        } as FoodSearchResult;
                                                                                        // Auto-add to diary (global store)
                                                                                        addEntry(selectedMealType, {
                                                                                                code: mapped.code,
                                                                                                name: mapped.name,
                                                                                                calories: mapped.calories,
                                                                                                protein: mapped.protein,
                                                                                                carbs: mapped.carbs,
                                                                                                fat: mapped.fat,
                                                                                                fiber: mapped.fiber,
                                                                                                imageUrl: mapped.imageUrl,
                                                                                                brand: mapped.brand,
                                                                                        });
                                                                                        setSearchResults([mapped]);
                                                                                        setSearchQuery(code);
                                                                                }
                                                                        } finally {
                                                                                setShowScanner(false);
                                                                        }
                                                                }}
                                                        />
                                                </View>
                                        </Modal>
                                )}

                                {/* Food Detail Modal */}
                                {selectedFoodForDetail && (
                                        <FoodDetailModal
                                                visible={showDetailModal}
                                                onClose={() => {
                                                        setShowDetailModal(false);
                                                        setSelectedFoodForDetail(null);
                                                }}
                                                food={selectedFoodForDetail}
                                                initialMealType={selectedMealType}
                                        />
                                )}
                        </SafeAreaView>
                </Modal>
        );
};
