const express = require('express');
const router = express.Router();
const MealLog = require('../models/MealLog');
const auth = require('../middleware/auth');

function startOfDay(dateInput) {
        const d = new Date(dateInput);
        d.setHours(0, 0, 0, 0);
        return d;
}

// Append a single entry into a meal bucket for a given date
// Body: { date: ISOString, mealType: 'breakfast'|'lunch'|'dinner'|'snack', entry: {...} }
router.post('/add', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { date, mealType, entry } = req.body || {};

                if (!date || !mealType || !entry) {
                        return res
                                .status(400)
                                .json({ success: false, message: 'date, mealType and entry are required' });
                }

                if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) {
                        return res.status(400).json({ success: false, message: 'Invalid mealType' });
                }

                const day = startOfDay(date);

                let mealLog = await MealLog.findOne({ userId });
                if (!mealLog) mealLog = new MealLog({ userId, mealLogs: [] });

                let dayIndex = mealLog.mealLogs.findIndex((d) => new Date(d.date).getTime() === day.getTime());
                if (dayIndex === -1) {
                        mealLog.mealLogs.push({
                                date: day,
                                meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
                        });
                        dayIndex = mealLog.mealLogs.length - 1;
                }

                const normalizedEntry = {
                        code: entry.code,
                        name: entry.name,
                        brand: entry.brand,
                        imageUrl: entry.imageUrl,
                        quantityGrams: entry.quantityGrams ?? 100,
                        calories: entry.calories ?? 0,
                        protein: entry.protein ?? 0,
                        carbs: entry.carbs ?? 0,
                        fat: entry.fat ?? 0,
                        fiber: entry.fiber ?? 0,
                        timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date(),
                };

                mealLog.mealLogs[dayIndex].meals[mealType].push(normalizedEntry);
                mealLog.mealLogs[dayIndex].updatedAt = new Date();

                const saved = await mealLog.save();
                return res.status(201).json({ success: true, data: saved });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to add meal entry', error: error.message });
        }
});

// Get a specific date's meals (or all, sorted desc)
router.get('/', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { date } = req.query || {};

                const doc = await MealLog.findOne({ userId });
                if (!doc) return res.json({ success: true, data: [] });

                if (date) {
                        const day = startOfDay(date);
                        const found = doc.mealLogs.find((d) => new Date(d.date).getTime() === day.getTime());
                        return res.json({ success: true, data: found ? [found] : [] });
                }

                const sorted = [...doc.mealLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
                return res.json({ success: true, data: sorted });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to fetch meal logs', error: error.message });
        }
});

// Update an existing entry for a given date/meal by index
router.put('/update', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { date, mealType, index, entry } = req.body || {};

                if (!date || !mealType || typeof index === 'undefined' || !entry) {
                        return res
                                .status(400)
                                .json({ success: false, message: 'date, mealType, index and entry are required' });
                }
                if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) {
                        return res.status(400).json({ success: false, message: 'Invalid mealType' });
                }

                const i = parseInt(index, 10);
                if (Number.isNaN(i) || i < 0) {
                        return res.status(400).json({ success: false, message: 'Valid index is required' });
                }

                const day = startOfDay(date);
                const doc = await MealLog.findOne({ userId });
                if (!doc) return res.status(404).json({ success: false, message: 'Meal log not found' });

                const dayIdx = doc.mealLogs.findIndex((d) => new Date(d.date).getTime() === day.getTime());
                if (dayIdx === -1) return res.status(404).json({ success: false, message: 'Day not found' });

                const list = doc.mealLogs[dayIdx].meals[mealType];
                if (!list || !list[i]) return res.status(404).json({ success: false, message: 'Entry not found' });

                // Only updatable fields
                const target = list[i];
                target.code = entry.code ?? target.code;
                target.name = entry.name ?? target.name;
                target.brand = entry.brand ?? target.brand;
                target.imageUrl = entry.imageUrl ?? target.imageUrl;
                if (typeof entry.quantityGrams === 'number') target.quantityGrams = entry.quantityGrams;
                if (typeof entry.calories === 'number') target.calories = entry.calories;
                if (typeof entry.protein === 'number') target.protein = entry.protein;
                if (typeof entry.carbs === 'number') target.carbs = entry.carbs;
                if (typeof entry.fat === 'number') target.fat = entry.fat;
                if (typeof entry.fiber === 'number') target.fiber = entry.fiber;
                target.timestamp = entry.timestamp ? new Date(entry.timestamp) : target.timestamp;

                doc.mealLogs[dayIdx].updatedAt = new Date();
                const saved = await doc.save();
                return res.json({ success: true, data: saved });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to update meal entry', error: error.message });
        }
});

// Remove an entry from a given date/meal by index
// Query/body: { date, mealType, index }
router.delete('/remove', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { date, mealType, index } = { ...req.query, ...req.body };

                if (!date || !mealType) {
                        return res.status(400).json({ success: false, message: 'date and mealType are required' });
                }
                if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) {
                        return res.status(400).json({ success: false, message: 'Invalid mealType' });
                }

                const i = parseInt(index, 10);
                if (Number.isNaN(i) || i < 0) {
                        return res.status(400).json({ success: false, message: 'Valid index is required' });
                }

                const day = startOfDay(date);
                const doc = await MealLog.findOne({ userId });
                if (!doc) return res.status(404).json({ success: false, message: 'Meal log not found' });

                const dayIdx = doc.mealLogs.findIndex((d) => new Date(d.date).getTime() === day.getTime());
                if (dayIdx === -1) return res.status(404).json({ success: false, message: 'Day not found' });

                const list = doc.mealLogs[dayIdx].meals[mealType];
                if (!list || !list[i]) return res.status(404).json({ success: false, message: 'Entry not found' });

                list.splice(i, 1);
                doc.mealLogs[dayIdx].updatedAt = new Date();
                await doc.save();

                return res.json({ success: true });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to remove meal entry', error: error.message });
        }
});

module.exports = router;
