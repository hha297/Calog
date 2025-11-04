const express = require('express');
const router = express.Router();
const ExerciseLog = require('../models/ExerciseLog');
const auth = require('../middleware/auth');

function startOfDay(dateInput) {
        const d = new Date(dateInput);
        d.setHours(0, 0, 0, 0);
        return d;
}

// Append a single entry into exercises for a given date
// Body: { date: ISOString, entry: {...} }
router.post('/add', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { date, entry } = req.body || {};

                if (!date || !entry) {
                        return res.status(400).json({ success: false, message: 'date and entry are required' });
                }

                const day = startOfDay(date);

                let exerciseLog = await ExerciseLog.findOne({ userId });
                if (!exerciseLog) exerciseLog = new ExerciseLog({ userId, exerciseLogs: [] });

                let dayIndex = exerciseLog.exerciseLogs.findIndex((d) => new Date(d.date).getTime() === day.getTime());
                if (dayIndex === -1) {
                        exerciseLog.exerciseLogs.push({
                                date: day,
                                exercises: [],
                        });
                        dayIndex = exerciseLog.exerciseLogs.length - 1;
                }

                const normalizedEntry = {
                        name: entry.name,
                        durationMinutes: entry.durationMinutes ?? 30,
                        calories: entry.calories ?? 0,
                        description: entry.description,
                        timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date(),
                };

                exerciseLog.exerciseLogs[dayIndex].exercises.push(normalizedEntry);
                exerciseLog.exerciseLogs[dayIndex].updatedAt = new Date();

                const saved = await exerciseLog.save();
                return res.status(201).json({ success: true, data: saved });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to add exercise entry', error: error.message });
        }
});

// Get a specific date's exercises (or all, sorted desc)
router.get('/', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { date } = req.query || {};

                const doc = await ExerciseLog.findOne({ userId });
                if (!doc) return res.json({ success: true, data: [] });

                if (date) {
                        const day = startOfDay(date);
                        const found = doc.exerciseLogs.find((d) => new Date(d.date).getTime() === day.getTime());
                        return res.json({ success: true, data: found ? [found] : [] });
                }

                const sorted = [...doc.exerciseLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
                return res.json({ success: true, data: sorted });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to fetch exercise logs', error: error.message });
        }
});

// Update an existing entry for a given date by index
router.put('/update', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { date, index, entry } = req.body || {};

                if (!date || typeof index === 'undefined' || !entry) {
                        return res
                                .status(400)
                                .json({ success: false, message: 'date, index and entry are required' });
                }

                const i = parseInt(index, 10);
                if (Number.isNaN(i) || i < 0) {
                        return res.status(400).json({ success: false, message: 'Valid index is required' });
                }

                const day = startOfDay(date);
                const doc = await ExerciseLog.findOne({ userId });
                if (!doc) return res.status(404).json({ success: false, message: 'Exercise log not found' });

                const dayIdx = doc.exerciseLogs.findIndex((d) => new Date(d.date).getTime() === day.getTime());
                if (dayIdx === -1) return res.status(404).json({ success: false, message: 'Day not found' });

                const list = doc.exerciseLogs[dayIdx].exercises;
                if (!list || !list[i]) return res.status(404).json({ success: false, message: 'Entry not found' });

                // Only updatable fields
                const target = list[i];
                target.name = entry.name ?? target.name;
                if (typeof entry.durationMinutes === 'number') target.durationMinutes = entry.durationMinutes;
                if (typeof entry.calories === 'number') target.calories = entry.calories;
                target.timestamp = entry.timestamp ? new Date(entry.timestamp) : target.timestamp;

                doc.exerciseLogs[dayIdx].updatedAt = new Date();
                const saved = await doc.save();
                return res.json({ success: true, data: saved });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to update exercise entry', error: error.message });
        }
});

// Remove an entry from a given date by index
// Query/body: { date, index }
router.delete('/remove', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { date, index } = { ...req.query, ...req.body };

                if (!date) {
                        return res.status(400).json({ success: false, message: 'date is required' });
                }

                const i = parseInt(index, 10);
                if (Number.isNaN(i) || i < 0) {
                        return res.status(400).json({ success: false, message: 'Valid index is required' });
                }

                const day = startOfDay(date);
                const doc = await ExerciseLog.findOne({ userId });
                if (!doc) return res.status(404).json({ success: false, message: 'Exercise log not found' });

                const dayIdx = doc.exerciseLogs.findIndex((d) => new Date(d.date).getTime() === day.getTime());
                if (dayIdx === -1) return res.status(404).json({ success: false, message: 'Day not found' });

                const list = doc.exerciseLogs[dayIdx].exercises;
                if (!list || !list[i]) return res.status(404).json({ success: false, message: 'Entry not found' });

                list.splice(i, 1);
                doc.exerciseLogs[dayIdx].updatedAt = new Date();
                await doc.save();

                return res.json({ success: true });
        } catch (error) {
                return res
                        .status(500)
                        .json({ success: false, message: 'Failed to remove exercise entry', error: error.message });
        }
});

module.exports = router;

