import apiClient from './client';

export interface OpenFoodFactsProduct {
        code: string;
        product?: {
                product_name?: string;
                brands?: string;
                image_url?: string;
                image_front_url?: string;
                image_front_small_url?: string;
                categories?: string;
                labels?: string;
                ingredients_text?: string;
                allergens?: string;
                countries?: string;
                packaging?: string;
                serving_size?: string;
                nutriments?: Record<string, number | string | undefined>;
        };
        status: number;
        status_verbose?: string;
}

export interface ParsedFoodData {
        barcode: string;
        foodName: string;
        brand?: string;
        categories: string[];
        labels: string[];
        ingredients: string[];
        allergens: string[];
        originCountry?: string;
        packaging?: string;
        servingSize?: string;
        imageUrl?: string;
        nutrients: {
                calories: number;
                protein: number;
                carbs: number;
                sugar: number;
                fat: number;
                saturatedFat: number;
                fiber: number;
                cholesterol: number;
                sodium: number;
        };
}

export async function fetchProductByBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
        if (!barcode) return null;
        const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
        try {
                const res = await fetch(url, {
                        headers: {
                                Accept: 'application/json',
                        },
                });
                if (!res.ok) return null;
                const data = (await res.json()) as OpenFoodFactsProduct;
                return data ?? null;
        } catch {
                return null;
        }
}

export function parseOpenFoodFactsData(data: OpenFoodFactsProduct): ParsedFoodData | null {
        if (!data?.product) return null;

        const product = data.product;

        // Parse categories
        const categories = product.categories ? product.categories.split(',').map((c) => c.trim()) : [];

        // Parse labels
        const labels = product.labels ? product.labels.split(',').map((l) => l.trim()) : [];

        // Parse ingredients
        const ingredients = product.ingredients_text ? product.ingredients_text.split(',').map((i) => i.trim()) : [];

        // Parse allergens
        const allergens = product.allergens ? product.allergens.split(',').map((a) => a.trim()) : [];

        // Parse nutrients
        const nutriments = product.nutriments || {};
        const nutrients = {
                calories:
                        parseFloat(nutriments['energy-kcal_100g'] as string) ||
                        parseFloat(nutriments['energy-kcal'] as string) ||
                        0,
                protein:
                        parseFloat(nutriments['proteins_100g'] as string) ||
                        parseFloat(nutriments['proteins'] as string) ||
                        0,
                carbs:
                        parseFloat(nutriments['carbohydrates_100g'] as string) ||
                        parseFloat(nutriments['carbohydrates'] as string) ||
                        0,
                sugar:
                        parseFloat(nutriments['sugars_100g'] as string) ||
                        parseFloat(nutriments['sugars'] as string) ||
                        0,
                fat: parseFloat(nutriments['fat_100g'] as string) || parseFloat(nutriments['fat'] as string) || 0,
                saturatedFat:
                        parseFloat(nutriments['saturated-fat_100g'] as string) ||
                        parseFloat(nutriments['saturated-fat'] as string) ||
                        0,
                fiber: parseFloat(nutriments['fiber_100g'] as string) || parseFloat(nutriments['fiber'] as string) || 0,
                cholesterol:
                        parseFloat(nutriments['cholesterol_100g'] as string) ||
                        parseFloat(nutriments['cholesterol'] as string) ||
                        0,
                sodium:
                        parseFloat(nutriments['sodium_100g'] as string) ||
                        parseFloat(nutriments['sodium'] as string) ||
                        0,
        };

        return {
                barcode: data.code,
                foodName: product.product_name || 'Unknown Product',
                brand: product.brands,
                categories,
                labels,
                ingredients,
                allergens,
                originCountry: product.countries,
                packaging: product.packaging,
                servingSize: product.serving_size,
                imageUrl: product.image_url,
                nutrients,
        };
}

export interface FoodEntry {
        source: 'scan' | 'manual';
        barcode?: string;
        dataSource: 'OpenFoodFacts' | 'UserInput';
        foodName: string;
        brand?: string;
        categories: string[];
        labels: string[];
        ingredients: string[];
        allergens: string[];
        originCountry?: string;
        packaging?: string;
        quantity: number;
        unit: string;
        servingSize?: string;
        perServing: boolean;
        nutrients: {
                calories: number;
                protein: number;
                carbs: number;
                sugar: number;
                fat: number;
                saturatedFat: number;
                fiber: number;
                cholesterol: number;
                sodium: number;
        };
        mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
        timestamp: string;
        imageUrl?: string;
        notes?: string;
        isFavorite: boolean;
}

export interface ApiResponse<T> {
        success: boolean;
        data?: T;
        message?: string;
}

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust based on your server

export async function addFoodEntry(foodData: FoodEntry): Promise<ApiResponse<any>> {
        try {
                console.log('Adding food entry:', foodData);
                console.log('API Base URL:', apiClient.getBaseUrl());
                const response = await apiClient.post('/api/food', foodData);
                return { success: true, data: (response as any).data };
        } catch (error) {
                console.error('Error adding food entry:', error);
                return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
        }
}

export async function getFoodEntries(params?: {
        page?: number;
        limit?: number;
        mealType?: string;
        date?: string;
}): Promise<ApiResponse<any>> {
        try {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append('page', params.page.toString());
                if (params?.limit) queryParams.append('limit', params.limit.toString());
                if (params?.mealType) queryParams.append('mealType', params.mealType);
                if (params?.date) queryParams.append('date', params.date);

                const response = await apiClient.get(`/food?${queryParams}`);
                return { success: true, data: (response as any).data };
        } catch (error) {
                console.error('Error fetching food entries:', error);
                return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
        }
}

// Helper function to get auth token (you'll need to implement this based on your auth system)
async function getAuthToken(): Promise<string> {
        // This should return the user's auth token from secure storage
        // For now, return empty string - you'll need to implement this
        return '';
}
