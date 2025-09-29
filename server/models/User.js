const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User role enum
const UserRole = {
        FREE: 'free',
        PREMIUM: 'premium',
        ADMIN: 'admin',
};

const userSchema = new mongoose.Schema(
        {
                // Google OAuth fields
                googleId: {
                        type: String,
                        unique: true,
                        sparse: true, // Allows null values but ensures uniqueness when present
                },
                name: {
                        type: String,
                        trim: true,
                        maxlength: [100, 'Name cannot exceed 100 characters'],
                },
                avatar: {
                        type: String,
                        trim: true,
                },
                refreshToken: {
                        type: String,
                        trim: true,
                },

                // Traditional auth fields (optional for Google OAuth users)
                fullName: {
                        type: String,
                        trim: true,
                        minlength: [2, 'Full name must be at least 2 characters'],
                        maxlength: [100, 'Full name cannot exceed 100 characters'],
                },
                email: {
                        type: String,
                        required: [true, 'Email is required'],
                        unique: true,
                        lowercase: true,
                        trim: true,
                        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
                passwordHash: {
                        type: String,
                        minlength: [6, 'Password must be at least 6 characters'],
                },
                role: {
                        type: String,
                        enum: Object.values(UserRole),
                        default: UserRole.FREE,
                },
                // User profile data
                profile: {
                        gender: {
                                type: String,
                                enum: ['male', 'female', 'other'],
                        },
                        age: {
                                type: Number,
                                min: [13, 'Age must be at least 13'],
                                max: [120, 'Age cannot exceed 120'],
                        },
                        height: {
                                type: Number, // in cm
                                min: [100, 'Height must be at least 100cm'],
                                max: [250, 'Height cannot exceed 250cm'],
                        },
                        weight: {
                                type: Number, // in kg
                                min: [30, 'Weight must be at least 30kg'],
                                max: [300, 'Weight cannot exceed 300kg'],
                        },
                        activityLevel: {
                                type: String,
                                enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
                        },
                        goal: {
                                type: String,
                                enum: ['maintain', 'lose', 'gain'],
                        },
                        targetWeight: {
                                type: Number, // in kg
                                min: [30, 'Target weight must be at least 30kg'],
                                max: [300, 'Target weight cannot exceed 300kg'],
                        },
                        weightChangeRate: {
                                type: Number, // in kg/week
                                min: [0.1, 'Weight change rate must be at least 0.1 kg/week'],
                                max: [1.0, 'Weight change rate cannot exceed 1.0 kg/week'],
                        },
                        tdee: {
                                type: Number, // Total Daily Energy Expenditure
                                min: [800, 'TDEE must be at least 800'],
                                max: [5000, 'TDEE cannot exceed 5000'],
                        },
                        dailyCalorieGoal: {
                                type: Number,
                                min: [800, 'Daily calorie goal must be at least 800'],
                                max: [5000, 'Daily calorie goal cannot exceed 5000'],
                        },
                },
                refreshTokens: [
                        {
                                token: String,
                                createdAt: {
                                        type: Date,
                                        default: Date.now,
                                },
                                expiresAt: Date,
                        },
                ],
        },
        {
                timestamps: true,
        },
);

// Hash password before saving (only for traditional auth users)
userSchema.pre('save', async function (next) {
        if (!this.isModified('passwordHash') || !this.passwordHash) return next();

        try {
                const salt = await bcrypt.genSalt(12);
                this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
                next();
        } catch (error) {
                next(error);
        }
});

// Compare password method (only for traditional auth users)
userSchema.methods.comparePassword = async function (candidatePassword) {
        if (!this.passwordHash) return false;
        return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Check if user is Google OAuth user
userSchema.methods.isGoogleUser = function () {
        return !!this.googleId;
};

// Add refresh token method
userSchema.methods.addRefreshToken = function (token, expiresAt) {
        this.refreshTokens.push({ token, expiresAt });
        // Keep only the 5 most recent refresh tokens
        if (this.refreshTokens.length > 5) {
                this.refreshTokens = this.refreshTokens.slice(-5);
        }
        return this.save();
};

// Remove refresh token method
userSchema.methods.removeRefreshToken = function (token) {
        this.refreshTokens = this.refreshTokens.filter((rt) => rt.token !== token);
        return this.save();
};

// Remove expired refresh tokens method
userSchema.methods.removeExpiredRefreshTokens = function () {
        const now = new Date();
        this.refreshTokens = this.refreshTokens.filter((rt) => rt.expiresAt > now);
        return this.save();
};

// Transform output
userSchema.methods.toJSON = function () {
        const userObject = this.toObject();
        delete userObject.passwordHash;
        delete userObject.refreshTokens;
        return userObject;
};

module.exports = {
        User: mongoose.model('User', userSchema),
        UserRole,
};
