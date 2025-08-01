const mongoose = require('mongoose');
const Streak = require('../models/streakDataModel');

// Route: lấy streak
// Route: lấy tất cả streak theo userId
exports.getStreak = async (req, res) => {
  try {
    // Đảm bảo userId là ObjectId
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    // Lấy tất cả streak của user này
    const streaks = await Streak.find({ userId: userObjectId });

    if (!streaks || streaks.length === 0) {
      return res.json([]);
    }

    // Trả về đầy đủ thông tin từng streak
    res.json(streaks);
  } catch (err) {
    console.error('Error getStreak:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStreakById = async (req, res) => {
  try {
    const streakData = await Streak.findById(req.params.id);
    if (!streakData) {
      // Không tìm thấy
      return res.status(404).json({ error: 'Streak not found' });
    }
    // Tìm thấy
    return res.status(200).json(streakData);
  } catch (err) {
    // Lỗi server hoặc id không đúng định dạng
    return res.status(500).json({ error: err.message });
  }
};


// Route: tăng streak
exports.increaseStreak = async (req, res) => {
  try {
    // Lấy ngày hiện tại (set về 0h00 UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    let streak = await Streak.findOne({ userId: userObjectId });

    // Helper: Lấy chuỗi yyyy-mm-dd
    function getDateString(date) {
      return date.toISOString().slice(0, 10);
    }

    // Nếu chưa có streak => tạo mới
    if (!streak) {
      streak = new Streak({
        userId: userObjectId,
        currentStreak: 1,
        bestStreak: 1,
        relapseCount: 0,
        lastDate: today
      });
      await streak.save();

      return res.status(201).json({
        message: 'Streak started!',
        currentStreak: streak.currentStreak,
        bestStreak: streak.bestStreak,
        relapseCount: streak.relapseCount
      });
    }

    // Đã có streak
    let lastDate = streak.lastDate ? new Date(streak.lastDate) : null;
    if (lastDate) lastDate.setUTCHours(0, 0, 0, 0);

    // So sánh ngày theo yyyy-mm-dd
    if (lastDate && getDateString(lastDate) === getDateString(today)) {
      // Đã tăng hôm nay
      return res.status(200).json({
        message: 'You have already increased your streak today.',
        currentStreak: streak.currentStreak,
        bestStreak: streak.bestStreak,
        relapseCount: streak.relapseCount
      });
    }

    let diffDays = 0;
    if (lastDate) {
      diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    }

    if (!lastDate || diffDays === 1) {
      // Lần đầu hoặc đúng 1 ngày: tăng streak
      streak.currentStreak += 1;
      if (streak.currentStreak > streak.bestStreak) {
        streak.bestStreak = streak.currentStreak;
      }
      streak.lastDate = today;

      await streak.save();

      return res.status(200).json({
        message: 'Streak increased!',
        currentStreak: streak.currentStreak,
        bestStreak: streak.bestStreak,
        relapseCount: streak.relapseCount
      });
    } else if (diffDays > 1) {
      // Bỏ lỡ nhiều ngày: reset streak và tăng relapse
      streak.currentStreak = 1;
      streak.relapseCount += 1;
      streak.lastDate = today;

      await streak.save();

      return res.status(200).json({
        message: 'Streak reset due to missed days.',
        currentStreak: streak.currentStreak,
        bestStreak: streak.bestStreak,
        relapseCount: streak.relapseCount
      });
    }

    // Trường hợp không xác định (an toàn)
    return res.status(400).json({ message: 'Invalid streak update.' });

  } catch (err) {
    console.error('Error increaseStreak:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.relapseStreak = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    let streak = await Streak.findOne({ userId: userObjectId });

    if (!streak) {
      return res.status(404).json({ error: "Streak not found" });
    }

    // Đặt lại currentStreak, tăng relapseCount, giữ nguyên bestStreak
    streak.currentStreak = 1;
    streak.relapseCount += 1;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    streak.lastDate = today;

    await streak.save();

    return res.status(200).json({
      message: "Relapse: currentStreak reset, relapseCount increased.",
      currentStreak: streak.currentStreak,
      bestStreak: streak.bestStreak,
      relapseCount: streak.relapseCount,
      lastDate: streak.lastDate
    });
  } catch (err) {
    console.error("Error in relapseStreak:", err);
    res.status(500).json({ error: err.message });
  }
};
