const mongoose = require('mongoose');

const mealEntrySchema = new mongoose.Schema(
        {
                code: { type: String },
                name: { type: String, required: true },
                brand: { type: String },
                imageUrl: { type: String },
                quantityGrams: { type: Number, default: 100 },
                calories: { type: Number, default: 0 },
                protein: { type: Number, default: 0 },
                carbs: { type: Number, default: 0 },
                fat: { type: Number, default: 0 },
                fiber: { type: Number, default: 0 },
                timestamp: { type: Date, default: Date.now },
        },
        { _id: false },
);

const mealsBucketSchema = new mongoose.Schema(
        {
                breakfast: { type: [mealEntrySchema], default: [] },
                lunch: { type: [mealEntrySchema], default: [] },
                dinner: { type: [mealEntrySchema], default: [] },
                snack: { type: [mealEntrySchema], default: [] },
        },
        { _id: false },
);

const dailyMealLogSchema = new mongoose.Schema(
        {
                date: { type: Date, required: true }, // normalized to start of day
                meals: { type: mealsBucketSchema, default: () => ({}) },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date, default: Date.now },
        },
        { _id: false },
);

const mealLogSchema = new mongoose.Schema(
        {
                userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                        unique: true,
                },
                mealLogs: { type: [dailyMealLogSchema], default: [] },
        },
        { timestamps: true },
);

mealLogSchema.index({ userId: 1 });
mealLogSchema.index({ userId: 1, 'mealLogs.date': -1 });

module.exports = mongoose.model('MealLog', mealLogSchema);
