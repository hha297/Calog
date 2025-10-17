export interface DietMode {
        id: string;
        name: string;
        carbsPercentage: number;
        proteinPercentage: number;
        fatPercentage: number;
        description?: string;
        // Ranges for wheel picker
        carbsRange: number[];
        proteinRange: number[];
        fatRange: number[];
}

export const DIET_MODES: DietMode[] = [
        {
                id: 'balanced',
                name: 'Balanced',
                carbsPercentage: 50,
                proteinPercentage: 20,
                fatPercentage: 30,
                description: 'A balanced approach to macronutrients',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
        {
                id: 'low-carb',
                name: 'Low Carb',
                carbsPercentage: 20,
                proteinPercentage: 30,
                fatPercentage: 50,
                description: 'Reduced carbohydrate intake for weight loss',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
        {
                id: 'high-protein',
                name: 'High Protein',
                carbsPercentage: 40,
                proteinPercentage: 40,
                fatPercentage: 20,
                description: 'Higher protein for muscle building',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
        {
                id: 'keto',
                name: 'Keto',
                carbsPercentage: 5,
                proteinPercentage: 20,
                fatPercentage: 75,
                description: 'Very low carb, high fat ketogenic diet',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
        {
                id: 'atkins',
                name: 'Atkins',
                carbsPercentage: 10,
                proteinPercentage: 30,
                fatPercentage: 60,
                description: 'Low carb diet focusing on protein and fat',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
        {
                id: 'paleo',
                name: 'Paleo',
                carbsPercentage: 35,
                proteinPercentage: 30,
                fatPercentage: 35,
                description: 'Whole foods based on ancestral eating',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
        {
                id: 'mediterranean',
                name: 'Mediterranean',
                carbsPercentage: 45,
                proteinPercentage: 20,
                fatPercentage: 35,
                description: 'Heart-healthy Mediterranean approach',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
        {
                id: 'dash',
                name: 'DASH',
                carbsPercentage: 55,
                proteinPercentage: 18,
                fatPercentage: 27,
                description: 'Dietary Approaches to Stop Hypertension',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
        {
                id: 'custom',
                name: 'Custom',
                carbsPercentage: 40,
                proteinPercentage: 30,
                fatPercentage: 30,
                description: 'Customize your own macronutrient ratios',
                carbsRange: Array.from({ length: 99 }, (_, i) => i + 1),
                proteinRange: Array.from({ length: 99 }, (_, i) => i + 1),
                fatRange: Array.from({ length: 99 }, (_, i) => i + 1),
        },
];

export const getDietModeById = (id: string): DietMode | undefined => {
        return DIET_MODES.find((mode) => mode.id === id);
};

export const validateMacroPercentages = (carbs: number, protein: number, fat: number): boolean => {
        return Math.abs(carbs + protein + fat - 100) < 0.1;
};
