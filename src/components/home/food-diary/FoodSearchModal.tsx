import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
        View,
        Modal,
        TouchableOpacity,
        TextInput,
        ScrollView,
        Image,
        ActivityIndicator,
        Pressable,
        Animated,
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
        Loader2,
} from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import { CText } from '../../ui/CText';
import { useTheme } from '../../../contexts';
import { COLORS } from '../../../style/color';
import { CameraView } from '../../CameraView';
import { fetchProductByBarcode, parseOpenFoodFactsData, getFoodEntries } from '../../../services/api/foodApi';
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
        selectedDate?: Date;
        onSelectFood?: (food: FoodSearchResult, mealType: MealKey) => void | Promise<void>;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
        visible,
        onClose,
        initialMealType = 'breakfast',
        selectedDate,
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

        const [showDetailModal, setShowDetailModal] = useState(false);
        const [selectedFoodForDetail, setSelectedFoodForDetail] = useState<FoodSearchResult | null>(null);
        const [myFoodList, setMyFoodList] = useState<FoodSearchResult[]>([]);
        const [isLoadingMyFood, setIsLoadingMyFood] = useState(false);
        const [showMyFood, setShowMyFood] = useState(false);
        const [addingFoodCode, setAddingFoodCode] = useState<string | null>(null); // Track which food is being added
        const spinAnim = useRef(new Animated.Value(0)).current;

        // Update selectedMealType when initialMealType changes or modal opens
        useEffect(() => {
                if (visible) {
                        setSelectedMealType(initialMealType);
                }
        }, [initialMealType, visible]);

        // Spinning animation for loading icon
        useEffect(() => {
                if (addingFoodCode) {
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
        }, [addingFoodCode, spinAnim]);

        const spin = spinAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
        });

        // Load My Food when modal opens
        useEffect(() => {
                if (visible) {
                        loadMyFood();
                }
        }, [visible]);

        // Load My Food from database
        const loadMyFood = async () => {
                setIsLoadingMyFood(true);
                try {
                        const response = await getFoodEntries({ limit: 1000 });
                        if (response.success && response.data) {
                                const foods = response.data.foods || response.data || [];

                                // Create a map to get unique foods by name (or code if available)
                                const uniqueFoodMap = new Map<string, any>();
                                foods.forEach((food: any) => {
                                        const key = food.barcode || food.id || food.foodName;
                                        if (key && !uniqueFoodMap.has(key)) {
                                                uniqueFoodMap.set(key, food);
                                        }
                                });

                                const uniqueFoods = Array.from(uniqueFoodMap.values());

                                // Convert Food entries to FoodSearchResult format
                                const allFoods: FoodSearchResult[] = uniqueFoods.map((food: any) => ({
                                        code: food.barcode || food.id || `food-${food.foodName}`,
                                        name: food.foodName || '',
                                        brand: food.brand,
                                        imageUrl: food.imageUrl,
                                        calories: food.nutrients?.calories || 0,
                                        protein: food.nutrients?.protein || 0,
                                        carbs: food.nutrients?.carbs || 0,
                                        fat: food.nutrients?.fat || 0,
                                        fiber: food.nutrients?.fiber || 0,
                                }));

                                setMyFoodList(allFoods);
                        } else {
                                setMyFoodList([]);
                        }
                } catch (error) {
                        console.error('Error loading My Food:', error);
                        setMyFoodList([]);
                } finally {
                        setIsLoadingMyFood(false);
                }
        };

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

                                        <View />
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
                                                                source={require('../../../assets/images/scan.json')}
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
                                                                        source={require('../../../assets/images/not_found.jpeg')}
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
                                                <View className="py-2">
                                                        {/* My Food Section */}
                                                        <View className="">
                                                                <TouchableOpacity
                                                                        onPress={() => setShowMyFood(!showMyFood)}
                                                                        activeOpacity={0.7}
                                                                        className={`mb-3 self-start rounded-full border px-4 py-3 ${
                                                                                showMyFood
                                                                                        ? 'border-primary bg-primary'
                                                                                        : 'border-textSecondary/20 dark:border-textSecondary/30'
                                                                        }`}
                                                                >
                                                                        <View className="flex-row items-center gap-2">
                                                                                <CText
                                                                                        weight="semibold"
                                                                                        className={
                                                                                                showMyFood
                                                                                                        ? 'text-white'
                                                                                                        : 'text-textPrimary dark:text-textPrimary-dark'
                                                                                        }
                                                                                >
                                                                                        My Food
                                                                                </CText>
                                                                                {isLoadingMyFood && (
                                                                                        <ActivityIndicator
                                                                                                size="small"
                                                                                                color={
                                                                                                        showMyFood
                                                                                                                ? '#fff'
                                                                                                                : COLORS.PRIMARY
                                                                                                }
                                                                                        />
                                                                                )}
                                                                        </View>
                                                                </TouchableOpacity>
                                                                {showMyFood && myFoodList.length > 0 && (
                                                                        <View className="gap-2">
                                                                                {myFoodList.map((food, index) => (
                                                                                        <View
                                                                                                key={`myfood-${food.code}-${index}`}
                                                                                                className="flex-row items-center gap-3 rounded-xl bg-surfacePrimary p-3 dark:bg-surfacePrimary-dark"
                                                                                        >
                                                                                                <TouchableOpacity
                                                                                                        onPress={() => {
                                                                                                                setSelectedFoodForDetail(
                                                                                                                        food,
                                                                                                                );
                                                                                                                setShowDetailModal(
                                                                                                                        true,
                                                                                                                );
                                                                                                        }}
                                                                                                        className="flex-1 flex-row items-center gap-3"
                                                                                                        activeOpacity={
                                                                                                                0.7
                                                                                                        }
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
                                                                                                                                source={require('../../../assets/images/not_found.jpeg')}
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
                                                                                                                        numberOfLines={
                                                                                                                                1
                                                                                                                        }
                                                                                                                >
                                                                                                                        {
                                                                                                                                food.name
                                                                                                                        }
                                                                                                                </CText>
                                                                                                                {food.brand && (
                                                                                                                        <CText
                                                                                                                                size="sm"
                                                                                                                                className="mt-1 text-textSecondary dark:text-textSecondary-dark"
                                                                                                                        >
                                                                                                                                {
                                                                                                                                        food.brand
                                                                                                                                }
                                                                                                                        </CText>
                                                                                                                )}
                                                                                                                <CText
                                                                                                                        size="sm"
                                                                                                                        className="mt-1 text-textSecondary dark:text-textSecondary-dark"
                                                                                                                >
                                                                                                                        {food.calories
                                                                                                                                ? `${food.calories} kcal`
                                                                                                                                : 'N/A'}{' '}
                                                                                                                        •
                                                                                                                        100g
                                                                                                                </CText>
                                                                                                        </View>
                                                                                                </TouchableOpacity>

                                                                                                {/* Add Button */}
                                                                                                <TouchableOpacity
                                                                                                        className="size-10 items-center justify-center rounded-full bg-primary"
                                                                                                        activeOpacity={
                                                                                                                0.7
                                                                                                        }
                                                                                                        onPress={async () => {
                                                                                                                if (
                                                                                                                        addingFoodCode ===
                                                                                                                        food.code
                                                                                                                )
                                                                                                                        return; // Prevent double click
                                                                                                                setAddingFoodCode(
                                                                                                                        food.code,
                                                                                                                );
                                                                                                                try {
                                                                                                                        if (
                                                                                                                                onSelectFood
                                                                                                                        ) {
                                                                                                                                await onSelectFood(
                                                                                                                                        food,
                                                                                                                                        selectedMealType,
                                                                                                                                );
                                                                                                                        }
                                                                                                                } catch (error) {
                                                                                                                        console.error(
                                                                                                                                'Error adding food:',
                                                                                                                                error,
                                                                                                                        );
                                                                                                                } finally {
                                                                                                                        // Reset loading state after operation completes
                                                                                                                        setAddingFoodCode(
                                                                                                                                null,
                                                                                                                        );
                                                                                                                }
                                                                                                        }}
                                                                                                        disabled={
                                                                                                                addingFoodCode ===
                                                                                                                food.code
                                                                                                        }
                                                                                                >
                                                                                                        {addingFoodCode ===
                                                                                                        food.code ? (
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
                                                                                ))}
                                                                        </View>
                                                                )}
                                                                {showMyFood &&
                                                                        myFoodList.length === 0 &&
                                                                        !isLoadingMyFood && (
                                                                                <CText className="py-4 text-center text-textSecondary dark:text-textSecondary-dark">
                                                                                        No saved foods yet
                                                                                </CText>
                                                                        )}
                                                        </View>

                                                        {/* Recent searches */}
                                                        <View className="mb-3">
                                                                <CText className="text-textSecondary dark:text-textSecondary-dark">
                                                                        Recent searches
                                                                </CText>
                                                        </View>
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
                                                                                                        source={require('../../../assets/images/not_found.jpeg')}
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
                                                                                onPress={async () => {
                                                                                        if (
                                                                                                addingFoodCode ===
                                                                                                food.code
                                                                                        )
                                                                                                return; // Prevent double click
                                                                                        setAddingFoodCode(food.code);
                                                                                        try {
                                                                                                if (onSelectFood) {
                                                                                                        await onSelectFood(
                                                                                                                food,
                                                                                                                selectedMealType,
                                                                                                        );
                                                                                                }
                                                                                        } catch (error) {
                                                                                                console.error(
                                                                                                        'Error adding food:',
                                                                                                        error,
                                                                                                );
                                                                                        } finally {
                                                                                                // Reset loading state after operation completes
                                                                                                setAddingFoodCode(null);
                                                                                        }
                                                                                }}
                                                                                disabled={addingFoodCode === food.code}
                                                                        >
                                                                                {addingFoodCode === food.code ? (
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
                                                                                                        size={20}
                                                                                                        color="#fff"
                                                                                                />
                                                                                        </Animated.View>
                                                                                ) : (
                                                                                        <Plus
                                                                                                size={20}
                                                                                                color="#fff"
                                                                                                strokeWidth={2}
                                                                                        />
                                                                                )}
                                                                        </TouchableOpacity>
                                                                </View>
                                                        ))}
                                                </View>
                                        )}
                                </ScrollView>

                                {/* Summary Modal removed */}

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
                                                                                        onSelectFood &&
                                                                                                onSelectFood(
                                                                                                        mapped,
                                                                                                        selectedMealType,
                                                                                                );
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
                                                selectedDate={selectedDate}
                                                mode={'add'}
                                        />
                                )}
                        </SafeAreaView>
                </Modal>
        );
};
