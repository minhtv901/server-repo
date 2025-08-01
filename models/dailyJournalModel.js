const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        note: {
            type: String,
            default: '',
        },
        mood: {
            type: String,
            enum: ['happy', 'sad', 'neutral', 'angry', 'anxious', 'excited'],
            default: 'neutral',
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const Journal = mongoose.model('dailyJournal', journalSchema, 'dailyJournal');
module.exports = Journal;