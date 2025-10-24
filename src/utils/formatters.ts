export const formatCalories = (calories: number): string => {
  return `${calories} cal`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const calculateBMI = (weight: number, height: number): number => {
  return weight / (height * height);
};
