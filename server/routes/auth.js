const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthController = require('../controllers/authController');
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

// POST /auth/signup
router.post(
        '/signup',
        [
                body('fullName')
                        .trim()
                        .isLength({ min: 2, max: 100 })
                        .withMessage('Full name must be between 2 and 100 characters'),
                body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
                body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        ],
        handleValidationErrors,
        AuthController.signup,
);

// POST /auth/login
router.post(
        '/login',
        [
                body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
                body('password').notEmpty().withMessage('Password is required'),
        ],
        handleValidationErrors,
        AuthController.login,
);

// POST /auth/refresh
router.post('/refresh', AuthController.refreshToken);

// POST /auth/logout
router.post('/logout', authMiddleware, AuthController.logout);

// GET /auth/me - Get current user info
router.get('/me', authMiddleware, AuthController.getCurrentUser);

module.exports = router;
