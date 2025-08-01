const mongoose = require('mongoose');

const ChecklistSchema = new mongoose.Schema(
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
        items: [
            {
                text: { type: String, required: true },
                checked: { type: Boolean, default: false }
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const CheckList = mongoose.model('dailyActivitiesChecklist', ChecklistSchema, 'dailyActivitiesChecklist');
module.exports = CheckList;