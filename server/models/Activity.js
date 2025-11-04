const mongoose = require('mongoose');

const activityEntrySchema = new mongoose.Schema(
        {
                name: {
                        type: String,
                        required: true,
                        trim: true,
                },
                caloriesPer30Min: {
                        type: Number,
                        required: true,
                        min: 0,
                },
                description: {
                        type: String,
                        trim: true,
                        default: '',
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
        { _id: true },
);

const activitySchema = new mongoose.Schema(
        {
                userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                        unique: true,
                },
                activities: { type: [activityEntrySchema], default: [] },
        },
        { timestamps: true },
);

activitySchema.index({ userId: 1 });
activitySchema.index({ userId: 1, 'activities.name': 1 });

module.exports = mongoose.model('Activity', activitySchema);
