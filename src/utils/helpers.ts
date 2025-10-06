// ==============================
// 📏 Body Composition & Fitness Utils
// ==============================

export interface BodyCompositionResult {
        bodyFatPercentage: number;
        bodyFatMass: number;
        leanBodyMass: number;
        ffmi: number;
}

export interface TDEEResult {
        bmr: number;
        tdee: number;
}

/**
 * Calculate body composition using the Navy Method.
 * @param weight - Weight in kg
 * @param height - Height in cm
 * @param age - Age in years
 * @param gender - 'male' | 'female'
 * @param neck - Neck circumference in cm
 * @param waist - Waist circumference in cm
 * @param hip - Hip circumference in cm (required for females)
 */
export const calculateBodyComposition = (
        weight: number,
        height: number,
        age: number,
        gender: string,
        neck?: number,
        waist?: number,
        hip?: number,
): BodyCompositionResult | null => {
        // ✅ Check required fields by gender
        if (gender === 'male' && (!neck || !waist)) return null;
        if (gender === 'female' && (!neck || !waist || !hip)) return null;

        // Convert cm → inches (Navy Method uses inches)
        const neckInches = neck! / 2.54;
        const waistInches = waist! / 2.54;
        const heightInches = height / 2.54;
        const hipInches = hip ? hip / 2.54 : 0;

        // Compute Body Fat %
        let bodyFatPercentage: number;

        if (gender === 'male') {
                // Navy Method formula using cm directly: BF% = 86.010 × log₁₀(waist - neck) - 70.041 × log₁₀(height) + 36.76
                bodyFatPercentage = 86.01 * Math.log10(waist! - neck!) - 70.041 * Math.log10(height) + 36.76;
        } else {
                // Navy Method formula for females using cm directly
                bodyFatPercentage = 163.205 * Math.log10(waist! + hip! - neck!) - 97.684 * Math.log10(height) - 78.387;
        }

        // Clamp to reasonable range (3%–50%)
        bodyFatPercentage = Math.max(3, Math.min(50, bodyFatPercentage));

        // Calculate derived metrics
        const bodyFatMass = (bodyFatPercentage / 100) * weight;
        const leanBodyMass = weight - bodyFatMass;
        const ffmi = leanBodyMass / Math.pow(height / 100, 2);

        // Round values
        return {
                bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
                bodyFatMass: Math.round(bodyFatMass * 10) / 10,
                leanBodyMass: Math.round(leanBodyMass * 10) / 10,
                ffmi: Math.round(ffmi * 10) / 10,
        };
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * using the Mifflin–St Jeor Equation
 */
export const calculateTDEE = (
        weight: number,
        height: number,
        age: number,
        gender: string,
        activityLevel: string,
): TDEEResult => {
        let bmr: number;

        if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const multipliers = {
                sedentary: 1.2,
                light: 1.375,
                moderate: 1.55,
                active: 1.725,
                very_active: 1.9,
        };

        const tdee = bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
        return { bmr: Math.round(bmr), tdee: Math.round(tdee) };
};

/**
 * Calculate BMI (Body Mass Index)
 * weight in kg, height in cm
 */
export const calculateBMI = (weight: number, height: number): string => {
        const h = height / 100;
        return (weight / (h * h)).toFixed(1);
};

/**
 * Get BMI category
 */
export const getBMIStatus = (bmi: number): string => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obesity';
};
