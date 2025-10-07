const mongoose = require('mongoose');

const measurementLogSchema = new mongoose.Schema(
        {
                userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                },
                measurements: {
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
                },
        },
        {
                timestamps: true, // Creates createdAt and updatedAt
        },
);

// Indexes for efficient queries
measurementLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MeasurementLog', measurementLogSchema);
