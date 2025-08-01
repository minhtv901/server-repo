const Streak = require('../models/streakDataModel');
const Milestone = require('../models/milestoneReflectionsModel'); // New model

const milestoneDays = [7, 14, 30, 60, 100];

// List of congratulation messages (English)
const congratulationMessages = [
  "Awesome! You've hit a ${day}-day streak!",
  "Keep it up! ${day} days in a row!",
  "Fantastic! ${day} days and counting!",
  "Great job! ${day} days of consistency!",
  "Impressive! ${day} days streak achieved!",
  "You're unstoppable! ${day} days streak!",
  "Well done! ${day} days in a row!"
];

// Function to get a random congratulation message for a milestone
function getRandomMessage(day) {
  const idx = Math.floor(Math.random() * congratulationMessages.length);
  return congratulationMessages[idx].replace('${day}', day);
}

// Check and save milestone when streak increases
exports.checkAndSaveMilestone = async (req, res) => {
  try {
    const userId = req.user._id;
    const streakData = await Streak.findOne({ userId });
    if (!streakData) return res.status(404).json({ message: 'Streak data not found' });

    const bestStreak = streakData.bestStreak;

    // Find or create user's milestone document
    let userMilestone = await Milestone.findOne({ userId });
    if (!userMilestone) {
      userMilestone = await Milestone.create({ userId, milestones: [] });
    }

    // Check and add new milestones if achieved
    for (let day of milestoneDays) {
      if (bestStreak >= day) {
        const existed = userMilestone.milestones.some(m => m.milestoneDay === day);
        if (!existed) {
          userMilestone.milestones.push({
            milestoneDay: day,
            note: getRandomMessage(day), // Use random congratulation message
            achievedAt: new Date()
          });
        }
      }
    }

    await userMilestone.save();

    // Return the list of achieved milestones
    const milestones = userMilestone.milestones.sort((a, b) => a.milestoneDay - b.milestoneDay);
    res.json({ milestones, bestStreak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get achieved and unachieved milestones based on bestStreak
exports.getMilestones = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const streakData = await Streak.findOne({ userId });
    const bestStreak = streakData ? streakData.bestStreak : 0;

    // Get user's milestone document
    const userMilestone = await Milestone.findOne({ userId });
    const achievedList = userMilestone ? userMilestone.milestones : [];

    // List of achieved milestones
    const achieved = milestoneDays
      .filter(day => bestStreak >= day)
      .map(day => {
        const m = achievedList.find(milestone => milestone.milestoneDay === day);
        return {
          days: day,
          note: m ? m.note : `You have reached the ${day}-day milestone!`,
          date: m ? m.achievedAt : null
        };
      });

    // List of not yet achieved milestones
    const achievedDays = achieved.map(m => m.days);
    const notAchieved = milestoneDays.filter(d => !achievedDays.includes(d));

    res.json({
      bestStreak,
      achieved,
      notAchieved
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
