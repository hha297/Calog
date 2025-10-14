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

// Add food entry
router.post('/', auth, async (req, res) => {
        try {
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

                const foodId = generateFoodId();
                const food = new Food({
                        id: foodId,
                        userId: req.user.userId,
                        source,
                        barcode,
                        dataSource,
                        foodName,
                        brand,
                        categories: categories || [],
                        labels: labels || [],
                        ingredients: ingredients || [],
                        allergens: allergens || [],
                        originCountry,
                        packaging,
                        quantity,
                        unit,
                        servingSize,
                        perServing: perServing !== undefined ? perServing : true,
                        nutrients: nutrients || {},
                        mealType: mealType || 'snack',
                        timestamp: timestamp ? new Date(timestamp) : new Date(),
                        imageUrl,
                        notes,
                        isFavorite: isFavorite || false,
                });

                await food.save();
                res.status(201).json(food);
        } catch (error) {
                console.error('Error adding food:', error);
                res.status(500).json({ message: 'Server error' });
        }
});

// Get user's food entries
router.get('/', auth, async (req, res) => {
        try {
                const { page = 1, limit = 20, mealType, date } = req.query;
                const query = { userId: req.user.userId, deletedAt: null };

                if (mealType) {
                        query.mealType = mealType;
                }

                if (date) {
                        const startOfDay = new Date(date);
                        startOfDay.setHours(0, 0, 0, 0);
                        const endOfDay = new Date(date);
                        endOfDay.setHours(23, 59, 59, 999);
                        query.timestamp = { $gte: startOfDay, $lte: endOfDay };
                }

                const foods = await Food.find(query)
                        .sort({ timestamp: -1 })
                        .limit(limit * 1)
                        .skip((page - 1) * limit);

                const total = await Food.countDocuments(query);

                res.json({
                        foods,
                        totalPages: Math.ceil(total / limit),
                        currentPage: page,
                        total,
                });
        } catch (error) {
                console.error('Error fetching foods:', error);
                res.status(500).json({ message: 'Server error' });
        }
});

// Update food entry
router.put('/:id', auth, async (req, res) => {
        try {
                const food = await Food.findOne({ id: req.params.id, userId: req.user.userId });
                if (!food) {
                        return res.status(404).json({ message: 'Food entry not found' });
                }

                const updatedFood = await Food.findOneAndUpdate(
                        { id: req.params.id, userId: req.user.userId },
                        { $set: req.body },
                        { new: true },
                );

                res.json(updatedFood);
        } catch (error) {
                console.error('Error updating food:', error);
                res.status(500).json({ message: 'Server error' });
        }
});

// Delete food entry (soft delete)
router.delete('/:id', auth, async (req, res) => {
        try {
                const food = await Food.findOne({ id: req.params.id, userId: req.user.userId });
                if (!food) {
                        return res.status(404).json({ message: 'Food entry not found' });
                }

                await Food.findOneAndUpdate(
                        { id: req.params.id, userId: req.user.userId },
                        { $set: { deletedAt: new Date() } },
                );

                res.json({ message: 'Food entry deleted' });
        } catch (error) {
                console.error('Error deleting food:', error);
                res.status(500).json({ message: 'Server error' });
        }
});

module.exports = router;
