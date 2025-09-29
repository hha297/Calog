const { User } = require('../models/User');
const { ResponseUtils } = require('../utils');

class ProfileController {
        // Calculate daily calorie goal using Mifflin-St Jeor Equation
        static calculateCalorieGoalFromProfile(profile) {
                const { gender, age, height, weight, activityLevel, goal, targetWeight, weightChangeRate } = profile;

                // Activity multipliers
                const activityMultipliers = {
                        sedentary: 1.2,
                        light: 1.375,
                        moderate: 1.55,
                        active: 1.725,
                        very_active: 1.9,
                };

                // Calculate BMR using Mifflin-St Jeor Equation
                let bmr;
                if (gender === 'male') {
                        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
                } else {
                        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
                }

                // Calculate TDEE (Total Daily Energy Expenditure)
                const tdee = bmr * activityMultipliers[activityLevel];

                // Adjust based on goal
                let dailyCalorieGoal;
                switch (goal) {
                        case 'lose':
                                if (targetWeight && weightChangeRate) {
                                        // Calculate calorie deficit based on weight change rate
                                        // 1 kg = ~7700 calories, so weekly deficit = weightChangeRate * 7700
                                        // Daily deficit = weekly deficit / 7
                                        const weeklyDeficit = weightChangeRate * 7700;
                                        const dailyDeficit = weeklyDeficit / 7;
                                        dailyCalorieGoal = Math.round(tdee - dailyDeficit);
                                } else {
                                        // Fallback to default 500 calorie deficit
                                        dailyCalorieGoal = Math.round(tdee - 500);
                                }
                                break;
                        case 'gain':
                                if (targetWeight && weightChangeRate) {
                                        // Calculate calorie surplus based on weight change rate
                                        // 1 kg = ~7700 calories, so weekly surplus = weightChangeRate * 7700
                                        // Daily surplus = weekly surplus / 7
                                        const weeklySurplus = weightChangeRate * 7700;
                                        const dailySurplus = weeklySurplus / 7;
                                        dailyCalorieGoal = Math.round(tdee + dailySurplus);
                                } else {
                                        // Fallback to default 500 calorie surplus
                                        dailyCalorieGoal = Math.round(tdee + 500);
                                }
                                break;
                        case 'maintain':
                        default:
                                dailyCalorieGoal = Math.round(tdee);
                                break;
                }

                // Ensure minimum and maximum bounds
                dailyCalorieGoal = Math.max(800, Math.min(5000, dailyCalorieGoal));

                return {
                        tdee: Math.round(tdee),
                        dailyCalorieGoal: dailyCalorieGoal,
                };
        }

        // Update user profile
        static async updateProfile(req, res) {
                try {
                        const userId = req.user.userId;
                        const profileData = req.body.profile;

                        // Validate required fields
                        const requiredFields = ['gender', 'age', 'height', 'weight', 'activityLevel', 'goal'];
                        for (const field of requiredFields) {
                                if (!profileData[field]) {
                                        return ResponseUtils.validationError(res, [
                                                { field, message: `${field} is required` },
                                        ]);
                                }
                        }

                        // Calculate daily calorie goal
                        const calorieData = ProfileController.calculateCalorieGoalFromProfile(profileData);

                        // Update user profile
                        const updateData = {
                                'profile.gender': profileData.gender,
                                'profile.age': profileData.age,
                                'profile.height': profileData.height,
                                'profile.weight': profileData.weight,
                                'profile.activityLevel': profileData.activityLevel,
                                'profile.goal': profileData.goal,
                                'profile.tdee': calorieData.tdee,
                                'profile.dailyCalorieGoal': calorieData.dailyCalorieGoal,
                        };

                        // Add optional weight goal fields if they exist
                        if (profileData.targetWeight !== undefined) {
                                updateData['profile.targetWeight'] = profileData.targetWeight;
                        }
                        if (profileData.weightChangeRate !== undefined) {
                                updateData['profile.weightChangeRate'] = profileData.weightChangeRate;
                        }

                        const updatedUser = await User.findByIdAndUpdate(
                                userId,
                                { $set: updateData },
                                { new: true, runValidators: true },
                        );

                        if (!updatedUser) {
                                return ResponseUtils.notFound(res, 'User not found');
                        }
                        return ResponseUtils.success(res, {
                                message: 'Profile updated successfully',
                                profile: updatedUser.profile,
                        });
                } catch (error) {
                        return ResponseUtils.serverError(res, 'Failed to update profile');
                }
        }

        // Get user profile
        static async getProfile(req, res) {
                try {
                        const userId = req.user.userId;

                        const user = await User.findById(userId).select('profile');
                        if (!user) {
                                return ResponseUtils.notFound(res, 'User not found');
                        }

                        return ResponseUtils.success(res, {
                                message: 'Profile retrieved successfully',
                                profile: user.profile || {},
                        });
                } catch (error) {
                        return ResponseUtils.serverError(res, 'Failed to get profile');
                }
        }

        // Calculate calorie goal only
        static async calculateCalorieGoal(req, res) {
                try {
                        const profileData = req.body;

                        // Validate required fields
                        const requiredFields = ['gender', 'age', 'height', 'weight', 'activityLevel', 'goal'];
                        for (const field of requiredFields) {
                                if (!profileData[field]) {
                                        return ResponseUtils.validationError(res, [
                                                { field, message: `${field} is required` },
                                        ]);
                                }
                        }

                        const calorieData = ProfileController.calculateCalorieGoalFromProfile(profileData);

                        return ResponseUtils.success(res, {
                                tdee: calorieData.tdee,
                                dailyCalorieGoal: calorieData.dailyCalorieGoal,
                        });
                } catch (error) {
                        return ResponseUtils.serverError(res, 'Failed to calculate calorie goal');
                }
        }
}

module.exports = ProfileController;
