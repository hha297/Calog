const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const auth = require('../middleware/auth');

// Generate unique food ID
const generateFoodId = () => {
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substr(2, 3).toUpperCase();
        return `food_${timestamp}_${random}`;
};

// Add food to user's food list (My Food)
router.post('/', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const {
                        source,
                        barcode,
                        dataSource,
                        foodName,
                        brand,
                        categories,
                        labels,
                        ingredients,
                        allergens,
                        originCountry,
                        packaging,
                        quantity,
                        unit,
                        servingSize,
                        perServing,
                        nutrients,
                        mealType,
                        timestamp,
                        imageUrl,
                        notes,
                        isFavorite,
                } = req.body;

                let userFood = await Food.findOne({ userId });
                if (!userFood) {
                        userFood = new Food({ userId, foods: [] });
                }

                // Check if food with same name already exists (for user input foods)
                if (dataSource === 'UserInput') {
                        const existing = userFood.foods.find(
                                (f) =>
                                        f.foodName.toLowerCase().trim() === foodName.toLowerCase().trim() &&
                                        f.barcode === barcode &&
                                        !f.deletedAt,
                        );
                        if (existing) {
                                return res.status(409).json({
                                        success: false,
                                        message: 'Food with this name already exists',
                                });
                        }
                }

                const foodId = generateFoodId();
                const newFood = {
                        id: foodId,
                        source: source || 'manual',
                        barcode: barcode || null,
                        dataSource: dataSource || 'UserInput',
                        foodName: foodName.trim(),
                        brand: brand || null,
                        categories: categories || [],
                        labels: labels || [],
                        ingredients: ingredients || [],
                        allergens: allergens || [],
                        originCountry: originCountry || null,
                        packaging: packaging || null,
                        quantity: quantity || 100,
                        unit: unit || 'g',
                        servingSize: servingSize || null,
                        perServing: perServing !== undefined ? perServing : true,
                        nutrients: nutrients || {},
                        mealType: mealType || 'snack',
                        timestamp: timestamp ? new Date(timestamp) : new Date(),
                        imageUrl: imageUrl || null,
                        notes: notes || null,
                        isFavorite: isFavorite || false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                };

                userFood.foods.push(newFood);
                const saved = await userFood.save();
                const addedFood = saved.foods[saved.foods.length - 1];
                return res.status(201).json({ success: true, data: addedFood });
        } catch (error) {
                return res.status(500).json({ success: false, message: 'Failed to add food', error: error.message });
        }
});

// Get user's food list (My Food)
router.get('/', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { limit = 1000, page = 1 } = req.query;

                const userFood = await Food.findOne({ userId });
                if (!userFood) {
                        return res.json({ success: true, data: { foods: [], total: 0 } });
                }

                // Filter out deleted foods
                const activeFoods = userFood.foods.filter((f) => !f.deletedAt);
                const total = activeFoods.length;

                // Apply pagination
                const startIndex = (page - 1) * limit;
                const paginatedFoods = activeFoods.slice(startIndex, startIndex + Number(limit));

                return res.json({
                        success: true,
                        data: {
                                foods: paginatedFoods,
                                total,
                                totalPages: Math.ceil(total / limit),
                                currentPage: Number(page),
                        },
                });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to fetch foods', error: error.message });
        }
});

// Update food entry
router.put('/:id', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { id } = req.params;

                const userFood = await Food.findOne({ userId });
                if (!userFood) {
                        return res.status(404).json({ success: false, message: 'User foods not found' });
                }

                const food = userFood.foods.id(id);
                if (!food) {
                        return res.status(404).json({ success: false, message: 'Food not found' });
                }

                // Update fields
                Object.keys(req.body).forEach((key) => {
                        if (req.body[key] !== undefined && key !== 'id' && key !== '_id') {
                                food[key] = req.body[key];
                        }
                });
                food.updatedAt = new Date();

                const saved = await userFood.save();
                return res.json({ success: true, data: food });
        } catch (error) {
                return res.status(500).json({ success: false, message: 'Failed to update food', error: error.message });
        }
});

// Delete food entry (soft delete)
router.delete('/:id', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { id } = req.params;

                const userFood = await Food.findOne({ userId });
                if (!userFood) {
                        return res.status(404).json({ success: false, message: 'User foods not found' });
                }

                const food = userFood.foods.id(id);
                if (!food) {
                        return res.status(404).json({ success: false, message: 'Food not found' });
                }

                food.deletedAt = new Date();
                food.updatedAt = new Date();
                await userFood.save();

                return res.json({ success: true });
        } catch (error) {
                return res.status(500).json({ success: false, message: 'Failed to delete food', error: error.message });
        }
});

module.exports = router;

