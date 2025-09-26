const express = require('express');
const { body, validationResult } = require('express-validator');
const ProfileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');
const { ResponseUtils } = require('../utils');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                return ResponseUtils.validationError(res, errors.array());
        }
        next();
};

// Profile validation rules
const profileValidation = [
        body('profile.gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
        body('profile.age').isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
        body('profile.height').isInt({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
        body('profile.weight').isInt({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg'),
        body('profile.activityLevel')
                .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
                .withMessage('Invalid activity level'),
        body('profile.goal').isIn(['maintain', 'lose', 'gain']).withMessage('Goal must be maintain, lose, or gain'),
];

// Calculate calorie goal validation
const calculateCalorieValidation = [
        body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
        body('age').isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
        body('height').isInt({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
        body('weight').isInt({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg'),
        body('activityLevel')
                .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
                .withMessage('Invalid activity level'),
        body('goal').isIn(['maintain', 'lose', 'gain']).withMessage('Goal must be maintain, lose, or gain'),
];

// PUT /api/profile - Update user profile
router.put('/', authMiddleware, profileValidation, handleValidationErrors, ProfileController.updateProfile);

// GET /api/profile - Get user profile
router.get('/', authMiddleware, ProfileController.getProfile);

// POST /api/profile/calculate-calories - Calculate daily calorie goal
router.post(
        '/calculate-calories',
        calculateCalorieValidation,
        handleValidationErrors,
        ProfileController.calculateCalorieGoal,
);

module.exports = router;
