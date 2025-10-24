import { create } from 'zustand';

interface DietStore {
  calories: number;
  meals: any[];
  addMeal: (meal: any) => void;
  updateCalories: (calories: number) => void;
}

export const useDietStore = create<DietStore>((set) => ({
  calories: 0,
  meals: [],
  addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
  updateCalories: (calories) => set({ calories }),
}));
