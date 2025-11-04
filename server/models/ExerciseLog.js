const mongoose = require('mongoose');

const exerciseEntrySchema = new mongoose.Schema(
        {
                name: { type: String, required: true },
                durationMinutes: { type: Number, default: 30 },
                calories: { type: Number, default: 0 },
                description: { type: String },
                timestamp: { type: Date, default: Date.now },
        },
        { _id: false },
);

const dailyExerciseLogSchema = new mongoose.Schema(
        {
                date: { type: Date, required: true }, // normalized to start of day
                exercises: { type: [exerciseEntrySchema], default: [] },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date, default: Date.now },
        },
        { _id: false },
);

const exerciseLogSchema = new mongoose.Schema(
        {
                userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                        unique: true,
                },
                exerciseLogs: { type: [dailyExerciseLogSchema], default: [] },
        },
        { timestamps: true },
);

exerciseLogSchema.index({ userId: 1 });
exerciseLogSchema.index({ userId: 1, 'exerciseLogs.date': -1 });

module.exports = mongoose.model('ExerciseLog', exerciseLogSchema);

