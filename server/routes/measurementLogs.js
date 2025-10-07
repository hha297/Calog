const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MeasurementLog = require('../models/MeasurementLog');
const { User } = require('../models/User');
const auth = require('../middleware/auth');

// Create measurement log (single document with all measurements)
router.post('/', auth, async (req, res) => {
        try {
                const { measurements } = req.body; // Object with { weight: {value, unit}, waist: {value, unit}, ... }
                const userId = req.user.userId;

                if (!userId) {
                        return res.status(401).json({
                                success: false,
                                message: 'User ID is required',
                        });
                }

                if (!measurements || typeof measurements !== 'object') {
                        return res.status(400).json({
                                success: false,
                                message: 'Measurements object is required',
                        });
                }

                // Create single measurement log document
                const measurementLog = new MeasurementLog({
                        userId,
                        measurements,
                });

                const savedLog = await measurementLog.save();

                // Update user's latest measurements snapshot and weight
                const measurementsSnapshot = {};
                let weightUpdate = {};

                Object.entries(measurements).forEach(([type, data]) => {
                        if (data && data.value !== undefined && data.value !== null) {
                                measurementsSnapshot[type] = data.value;
                                // Also update weight field if it's a weight measurement
                                if (type === 'weight') {
                                        weightUpdate['profile.weight'] = data.value;
                                }
                        }
                });

                const updateData = {
                        $set: {
                                'profile.measurements': measurementsSnapshot,
                                'profile.updatedAt': new Date(),
                                ...weightUpdate,
                        },
                };

                await User.findByIdAndUpdate(userId, updateData);

                res.status(201).json({
                        success: true,
                        data: savedLog,
                        message: 'Measurement log created successfully',
                });
        } catch (error) {
                console.error('Error creating measurement log:', error);
                res.status(500).json({
                        success: false,
                        message: 'Failed to create measurement log',
                        error: error.message,
                });
        }
});

// Get measurement logs for user (sorted by most recent)
router.get('/', auth, async (req, res) => {
        try {
                const userId = req.user.userId;
                const { limit = 50, page = 1, type } = req.query;

                const skip = (page - 1) * limit;
                const filter = { userId };
                if (type) filter.type = type;

                const logs = await MeasurementLog.find(filter)
                        .sort({ createdAt: -1 })
                        .limit(parseInt(limit))
                        .skip(skip);

                const total = await MeasurementLog.countDocuments(filter);

                res.json({
                        success: true,
                        data: logs,
                        pagination: {
                                total,
                                page: parseInt(page),
                                limit: parseInt(limit),
                                pages: Math.ceil(total / limit),
                        },
                });
        } catch (error) {
                console.error('Error fetching measurement logs:', error);
                res.status(500).json({
                        success: false,
                        message: 'Failed to fetch measurement logs',
                        error: error.message,
                });
        }
});

// Get latest measurement logs grouped by type
router.get('/latest', auth, async (req, res) => {
        try {
                const userId = req.user.userId;

                const latestLogs = await MeasurementLog.find({ userId }).sort({ createdAt: -1 }).limit(1);

                res.json({
                        success: true,
                        data: latestLogs,
                });
        } catch (error) {
                console.error('Error fetching latest measurement logs:', error);
                res.status(500).json({
                        success: false,
                        message: 'Failed to fetch latest measurement logs',
                        error: error.message,
                });
        }
});

// Get measurement logs by groupId
router.get('/group/:groupId', auth, async (req, res) => {
        try {
                const { groupId } = req.params;
                const userId = req.user.userId;

                const logs = await MeasurementLog.find({
                        userId,
                        groupId: new mongoose.Types.ObjectId(groupId),
                }).sort({ createdAt: -1 });

                res.json({
                        success: true,
                        data: logs,
                });
        } catch (error) {
                console.error('Error fetching measurement logs by group:', error);
                res.status(500).json({
                        success: false,
                        message: 'Failed to fetch measurement logs by group',
                        error: error.message,
                });
        }
});

// Delete measurement log
router.delete('/:id', auth, async (req, res) => {
        try {
                const { id } = req.params;
                const userId = req.user.userId;

                const log = await MeasurementLog.findOneAndDelete({
                        _id: id,
                        userId,
                });

                if (!log) {
                        return res.status(404).json({
                                success: false,
                                message: 'Measurement log not found',
                        });
                }

                // Update user's measurements snapshot to latest remaining log
                const latestLog = await MeasurementLog.findOne({ userId }).sort({ createdAt: -1 });

                if (latestLog) {
                        // Update with latest measurements
                        const measurementsSnapshot = {};
                        Object.entries(latestLog.measurements).forEach(([type, data]) => {
                                if (data && data.value !== undefined && data.value !== null) {
                                        measurementsSnapshot[type] = data.value;
                                }
                        });

                        await User.findByIdAndUpdate(userId, {
                                $set: {
                                        'profile.measurements': measurementsSnapshot,
                                        'profile.updatedAt': new Date(),
                                },
                        });
                } else {
                        // No logs left, clear measurements snapshot
                        await User.findByIdAndUpdate(userId, {
                                $unset: {
                                        'profile.measurements': 1,
                                },
                                $set: {
                                        'profile.updatedAt': new Date(),
                                },
                        });
                }

                res.json({
                        success: true,
                        message: 'Measurement log deleted successfully',
                });
        } catch (error) {
                console.error('Error deleting measurement log:', error);
                res.status(500).json({
                        success: false,
                        message: 'Failed to delete measurement log',
                        error: error.message,
                });
        }
});

module.exports = router;
