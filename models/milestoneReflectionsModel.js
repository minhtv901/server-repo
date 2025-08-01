const mongoose = require('mongoose');

// Schema cho từng milestone trong array
const singleMilestoneSchema = new mongoose.Schema(
  {
    milestoneDay: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    achievedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { _id: false } // Không tạo _id cho từng milestone con
);

// Schema tổng
const milestoneProgressSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    milestones: [singleMilestoneSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Milestone = mongoose.model('MilestoneProgress', milestoneProgressSchema, 'milestoneReflections');
module.exports = Milestone;
