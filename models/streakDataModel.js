const mongoose = require('mongoose')

const streakSchema = new mongoose.Schema (
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            
        },
        currentStreak: {
            type: Number,
            default: 0,
        },
        bestStreak: {
            type: Number,
            default: 0
        },
        relapseCount: {
            type: Number,
            default: 0
        },
        lastDate: {
            type: Date,
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const Streak = mongoose.model('Streak', streakSchema, 'streakData');
module.exports = Streak;