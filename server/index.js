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
const { ErrorUtils } = require('./utils');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Check if required environment variables are set
if (!MONGO_URI) {
        console.error('MONGO_URI environment variable is required');
        console.error('Make sure .env file exists in server directory');
        process.exit(1);
}
// Security middleware
app.use(helmet());
app.use(
        cors({
                origin:
                        process.env.NODE_ENV === 'production'
                                ? ['https://your-app-domain.com']
                                : [
                                          'http://localhost:3000',
                                          'http://localhost:8081',
                                          'http://10.0.2.2:4000', // Android emulator
                                          'http://10.0.2.2:8081', // Android emulator Metro
                                  ],
                credentials: true,
        }),
);

// Rate limiting
const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
})
        .then(() => {})
        .catch((error) => {
                console.error('MongoDB connection error:', error);
                process.exit(1);
        });

// Routes
app.use('/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/measurement-logs', measurementLogRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
        res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
        res.status(404).json({
                success: false,
                message: 'Route not found',
        });
});

// Global error handler
app.use(ErrorUtils.globalErrorHandler);

app.listen(PORT, () => {});

module.exports = app;
