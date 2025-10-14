const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
        id: {
                type: String,
                required: true,
                unique: true,
        },
        userId: {
                type: String,
                required: true,
        },
        source: {
                type: String,
                enum: ['scan', 'manual'],
                required: true,
        },
        barcode: {
                type: String,
                default: null,
        },
        dataSource: {
                type: String,
                enum: ['OpenFoodFacts', 'UserInput'],
                required: true,
        },
        foodName: {
                type: String,
                required: true,
        },
        brand: {
                type: String,
                default: null,
        },
        categories: [
                {
                        type: String,
                },
        ],
        labels: [
                {
                        type: String,
                },
        ],
        ingredients: [
                {
                        type: String,
                },
        ],
        allergens: [
                {
                        type: String,
                },
        ],
        originCountry: {
                type: String,
                default: null,
        },
        packaging: {
                type: String,
                default: null,
        },
        quantity: {
                type: Number,
                required: true,
        },
        unit: {
                type: String,
                required: true,
        },
        servingSize: {
                type: String,
                default: null,
        },
        perServing: {
                type: Boolean,
                default: true,
        },
        nutrients: {
                calories: { type: Number, default: 0 },
                protein: { type: Number, default: 0 },
                carbs: { type: Number, default: 0 },
                sugar: { type: Number, default: 0 },
                fat: { type: Number, default: 0 },
                saturatedFat: { type: Number, default: 0 },
                fiber: { type: Number, default: 0 },
                cholesterol: { type: Number, default: 0 },
                sodium: { type: Number, default: 0 },
        },
        mealType: {
                type: String,
                enum: ['breakfast', 'lunch', 'dinner', 'snack'],
                default: 'snack',
        },
        timestamp: {
                type: Date,
                required: true,
        },
        imageUrl: {
                type: String,
                default: null,
        },
        notes: {
                type: String,
                default: null,
        },
        isFavorite: {
                type: Boolean,
                default: false,
        },
        createdAt: {
                type: Date,
                default: Date.now,
        },
        updatedAt: {
                type: Date,
                default: Date.now,
        },
        deletedAt: {
                type: Date,
                default: null,
        },
});

// Update the updatedAt field before saving
foodSchema.pre('save', function (next) {
        this.updatedAt = new Date();
        next();
});

module.exports = mongoose.model('Food', foodSchema);
