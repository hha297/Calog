export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: 'lose' | 'maintain' | 'gain';
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
}

export interface Meal {
  id: string;
  foodId: string;
  quantity: number;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}
