import apiClient from './client';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntryDTO {
        code?: string;
        name: string;
        brand?: string;
        imageUrl?: string;
        quantityGrams?: number;
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        fiber?: number;
        timestamp?: string; // ISO
}

export async function addMealEntry(dateISO: string, mealType: MealType, entry: MealEntryDTO) {
        return apiClient.post('/api/meal-logs/add', { date: dateISO, mealType, entry });
}

export async function getDailyMeals(dateISO: string) {
        const params = new URLSearchParams({ date: dateISO }).toString();
        return apiClient.get(`/api/meal-logs?${params}`);
}

export async function getMonthlyMeals(month: number, year: number) {
        const params = new URLSearchParams({ month: String(month), year: String(year) }).toString();
        return apiClient.get(`/api/meal-logs?${params}`);
}

export async function deleteMealEntry(dateISO: string, mealType: MealType, index: number) {
        const params = new URLSearchParams({ date: dateISO, mealType, index: String(index) }).toString();
        return apiClient.delete(`/api/meal-logs/remove?${params}`);
}

export async function updateMealEntry(
        dateISO: string,
        mealType: MealType,
        index: number,
        entry: Partial<MealEntryDTO>,
) {
        return apiClient.put('/api/meal-logs/update', { date: dateISO, mealType, index, entry });
}
