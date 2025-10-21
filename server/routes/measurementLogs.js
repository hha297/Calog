const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MeasurementLog = require('../models/MeasurementLog');
const { User } = require('../models/User');
const auth = require('../middleware/auth');

// Create measurement log (add to user's measurements array)
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

                // Add timestamps to the measurement entry
                const measurementEntry = {
                        ...measurements,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                };

                // Find existing measurement log for user or create new one
                let measurementLog = await MeasurementLog.findOne({ userId });

                if (!measurementLog) {
                        // Create new measurement log document for user
                        measurementLog = new MeasurementLog({
                                userId,
                                measurements: [measurementEntry],
                        });
                } else {
                        // Add new measurement to existing array
                        measurementLog.measurements.push(measurementEntry);
                }

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
                const { limit = 50, page = 1 } = req.query;

                const skip = (page - 1) * limit;

                // Find user's measurement log document
                const measurementLog = await MeasurementLog.findOne({ userId });

                if (!measurementLog) {
                        return res.json({
                                success: true,
                                data: [],
                                pagination: {
                                        total: 0,
                                        page: parseInt(page),
                                        limit: parseInt(limit),
                                        pages: 0,
                                },
                        });
                }

                // Sort measurements by createdAt descending and apply pagination
                const sortedMeasurements = measurementLog.measurements
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(skip, skip + parseInt(limit));

                const total = measurementLog.measurements.length;

                res.json({
                        success: true,
                        data: sortedMeasurements,
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

                // Find user's measurement log document
                const measurementLog = await MeasurementLog.findOne({ userId });

                if (!measurementLog || measurementLog.measurements.length === 0) {
                        return res.json({
                                success: true,
                                data: [],
                        });
                }

                // Get the most recent measurement entry
                const latestMeasurement = measurementLog.measurements.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                )[0];

                res.json({
                        success: true,
                        data: [latestMeasurement],
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

// Get measurement logs by groupId (deprecated - keeping for backward compatibility)
router.get('/group/:groupId', auth, async (req, res) => {
        try {
                const { groupId } = req.params;
                const userId = req.user.userId;

                // Since we now store all measurements in a single document per user,
                // this endpoint returns all measurements for the user
                const measurementLog = await MeasurementLog.findOne({ userId });

                if (!measurementLog) {
                        return res.json({
                                success: true,
                                data: [],
                        });
                }

                res.json({
                        success: true,
                        data: measurementLog.measurements,
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

// Delete measurement log (by index in array)
router.delete('/:index', auth, async (req, res) => {
        try {
                const { index } = req.params;
                const userId = req.user.userId;
                const measurementIndex = parseInt(index);

                if (isNaN(measurementIndex)) {
                        return res.status(400).json({
                                success: false,
                                message: 'Invalid measurement index',
                        });
                }

                // Find user's measurement log document
                const measurementLog = await MeasurementLog.findOne({ userId });

                if (!measurementLog || !measurementLog.measurements[measurementIndex]) {
                        return res.status(404).json({
                                success: false,
                                message: 'Measurement log not found',
                        });
                }

                // Remove the measurement at the specified index
                measurementLog.measurements.splice(measurementIndex, 1);
                await measurementLog.save();

                // Update user's measurements snapshot to latest remaining measurement
                if (measurementLog.measurements.length > 0) {
                        const latestMeasurement = measurementLog.measurements.sort(
                                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                        )[0];

                        const measurementsSnapshot = {};
                        Object.entries(latestMeasurement).forEach(([type, data]) => {
                                if (
                                        data &&
                                        typeof data === 'object' &&
                                        data.value !== undefined &&
                                        data.value !== null
                                ) {
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
                        // No measurements left, clear measurements snapshot
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
