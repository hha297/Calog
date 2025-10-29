import React, { useState } from 'react';
import { Image, ImageSourcePropType, View, TouchableOpacity } from 'react-native';
import { CText } from '../ui';
import { useDiaryStore } from '../../store/diaryStore';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS } from '../../style/color';
import { FoodSearchModal } from './FoodSearchModal';

type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealItem {
        key: MealKey;
        title: string;
        image: ImageSourcePropType;
}

const MEALS: MealItem[] = [
        { key: 'breakfast', title: 'Breakfast', image: require('../../assets/images/breakfast.png') },
        { key: 'lunch', title: 'Lunch', image: require('../../assets/images/lunch.png') },
        { key: 'dinner', title: 'Dinner', image: require('../../assets/images/dinner.png') },
        { key: 'snack', title: 'Snack', image: require('../../assets/images/dessert.png') },
];

export const FoodDiary: React.FC = () => {
        const [expanded, setExpanded] = useState<boolean>(true);
        const [showSearchModal, setShowSearchModal] = useState(false);
        const [selectedMealType, setSelectedMealType] = useState<MealKey | null>(null);
        const addEntry = useDiaryStore((s) => s.addEntry);

        const handleMealPress = (mealKey: MealKey) => {
                setSelectedMealType(mealKey);
                setShowSearchModal(true);
        };

        const handleAddMealPress = () => {
                setSelectedMealType(null);
                setShowSearchModal(true);
        };

        const handleSelectFood = (
                food: { code: string; name: string; calories?: number; imageUrl?: string; brand?: string },
                mealType: MealKey,
        ) => {
                addEntry(mealType, food);
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
                                <View className="border-border-light/10 rounded-xl border py-4 dark:border-border-dark/20">
                                        <CText
                                                size="lg"
                                                weight="medium"
                                                className="mb-3 text-textPrimary dark:text-textPrimary-dark"
                                        >
                                                Meal details
                                        </CText>
                                        <View className="items-center justify-center rounded-xl border border-surfaceSecondary bg-surfaceSecondary py-4 dark:border-surfaceSecondary-dark dark:bg-surfaceSecondary-dark">
                                                <CText className="mb-3 text-center text-textSecondary dark:text-textSecondary-dark">
                                                        You haven't added any meals yet
                                                </CText>
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
                                                                className="text-textPrimary dark:text-textPrimary-dark"
                                                        >
                                                                Add your meal !
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
                                onSelectFood={handleSelectFood}
                        />
                </View>
        );
};
