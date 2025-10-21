const mongoose = require('mongoose');

const measurementLogSchema = new mongoose.Schema(
        {
                userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                        unique: true, // Ensure only one document per user
                },
                measurements: [
                        {
                                weight: {
                                        value: Number,
                                        unit: { type: String, enum: ['kg'], default: 'kg' },
                                },
                                waist: {
                                        value: Number,
                                        unit: { type: String, enum: ['cm'], default: 'cm' },
                                },
                                hip: {
                                        value: Number,
                                        unit: { type: String, enum: ['cm'], default: 'cm' },
                                },
                                neck: {
                                        value: Number,
                                        unit: { type: String, enum: ['cm'], default: 'cm' },
                                },
                                thigh: {
                                        value: Number,
                                        unit: { type: String, enum: ['cm'], default: 'cm' },
                                },
                                bicep: {
                                        value: Number,
                                        unit: { type: String, enum: ['cm'], default: 'cm' },
                                },
                                createdAt: {
                                        type: Date,
                                        default: Date.now,
                                },
                                updatedAt: {
                                        type: Date,
                                        default: Date.now,
                                },
                        },
                ],
        },
        {
                timestamps: true, // Creates createdAt and updatedAt for the main document
        },
);

// Indexes for efficient queries
measurementLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MeasurementLog', measurementLogSchema);
