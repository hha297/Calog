const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const measurementLogRoutes = require('./routes/measurementLogs');
const foodRoutes = require('./routes/food');
const mealLogRoutes = require('./routes/mealLogs');
const exerciseLogRoutes = require('./routes/exerciseLogs');
const activityRoutes = require('./routes/activities');
const userFoodRoutes = require('./routes/userFoods');
const { ErrorUtils } = require('./utils');

const app = express();

// 🧠 Show environment info
console.log('==========================================');
console.log('🚀 Starting Calog backend...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('==========================================');

// Allow Express to trust proxy (Render/Heroku)
app.set('trust proxy', 1);

// Use provided Render port or fallback
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// 🔎 Verify critical ENV
if (!MONGO_URI) {
        console.error('❌ MONGO_URI environment variable is required.');
        console.error('Make sure .env file exists or Render env vars are configured.');
        process.exit(1);
}

// Security middleware
app.use(helmet());

// Logging middleware for every request
app.use((req, res, next) => {
        const start = Date.now();
        console.log(`➡️  ${req.method} ${req.originalUrl} | IP: ${req.ip || req.headers['x-forwarded-for']}`);

        res.on('finish', () => {
                const duration = Date.now() - start;
                console.log(`✅ ${req.method} ${req.originalUrl} → ${res.statusCode} [${duration}ms]`);
        });

        next();
});

// CORS setup
app.use(
        cors({
                origin:
                        process.env.NODE_ENV === 'production'
                                ? ['https://calog.onrender.com']
                                : [
                                          'http://localhost:3000',
                                          'http://localhost:8081',
                                          'http://10.0.2.2:4000',
                                          'http://10.0.2.2:8081',
                                  ],
                credentials: true,
        }),
);

// Rate limiting
const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
                console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
                res.status(429).json({
                        success: false,
                        message: 'Too many requests, please try again later.',
                });
        },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ MongoDB connected successfully'))
        .catch((error) => {
                console.error('❌ MongoDB connection error:', error);
                process.exit(1);
        });

// Routes
app.use('/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/measurement-logs', measurementLogRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/meal-logs', mealLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/user-foods', userFoodRoutes);

// 404
app.use('*', (req, res) => {
        console.warn(`⚠️ 404 Not Found: ${req.originalUrl}`);
        res.status(404).json({
                success: false,
                message: 'Route not found',
        });
});

// Global error handler
app.use((err, req, res, next) => {
        console.error(`🔥 Error on ${req.method} ${req.originalUrl}:`, err);
        ErrorUtils.globalErrorHandler(err, req, res, next);
});

// Start server
app.listen(PORT, () => {
        console.log(`✅ Server is live on port ${PORT}`);
});

module.exports = app;
