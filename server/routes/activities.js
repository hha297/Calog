const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Create a new custom activity
router.post('/', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { name, caloriesPer30Min, description } = req.body || {};

                if (!name || caloriesPer30Min === undefined) {
                        return res
                                .status(400)
                                .json({ success: false, message: 'name and caloriesPer30Min are required' });
                }

                let userActivity = await Activity.findOne({ userId });
                if (!userActivity) {
                        userActivity = new Activity({ userId, activities: [] });
                }

                // Check if activity with same name already exists
                const existing = userActivity.activities.find(
                        (a) => a.name.toLowerCase().trim() === name.toLowerCase().trim(),
                );
                if (existing) {
                        return res.status(409).json({
                                success: false,
                                message: 'Activity with this name already exists',
                        });
                }

                // Add new activity
                userActivity.activities.push({
                        name: name.trim(),
                        caloriesPer30Min: Number(caloriesPer30Min),
                        description: description?.trim() || '',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                });

                const saved = await userActivity.save();
                const newActivity = saved.activities[saved.activities.length - 1];
                return res.status(201).json({ success: true, data: newActivity });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to create activity', error: error.message });
        }
});

// Get all custom activities for the user
router.get('/', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const userActivity = await Activity.findOne({ userId });
                if (!userActivity) {
                        return res.json({ success: true, data: [] });
                }
                return res.json({ success: true, data: userActivity.activities });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to fetch activities', error: error.message });
        }
});

// Update an activity
router.put('/:id', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { id } = req.params;
                const { name, caloriesPer30Min, description } = req.body || {};

                const userActivity = await Activity.findOne({ userId });
                if (!userActivity) {
                        return res.status(404).json({ success: false, message: 'User activities not found' });
                }

                const activity = userActivity.activities.id(id);
                if (!activity) {
                        return res.status(404).json({ success: false, message: 'Activity not found' });
                }

                if (name !== undefined) activity.name = name.trim();
                if (caloriesPer30Min !== undefined) activity.caloriesPer30Min = Number(caloriesPer30Min);
                if (description !== undefined) activity.description = description?.trim() || '';
                activity.updatedAt = new Date();

                const saved = await userActivity.save();
                return res.json({ success: true, data: activity });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to update activity', error: error.message });
        }
});

// Delete an activity
router.delete('/:id', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { id } = req.params;

                const userActivity = await Activity.findOne({ userId });
                if (!userActivity) {
                        return res.status(404).json({ success: false, message: 'User activities not found' });
                }

                const activity = userActivity.activities.id(id);
                if (!activity) {
                        return res.status(404).json({ success: false, message: 'Activity not found' });
                }

                activity.deleteOne();
                await userActivity.save();

                return res.json({ success: true });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to delete activity', error: error.message });
        }
});

module.exports = router;
