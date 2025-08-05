const User = require('../models/userModel');
const Streak = require('../models/streakDataModel');
const Milestone = require('../models/milestoneReflectionsModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ msg: 'Account already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      registerDate: new Date()
    });

    await newUser.save();

    // Generate JWT token after successful registration
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, "SECRET_KEY", { expiresIn: "7d" });

    await newUser.save();
    res.status(201).json({ 
      msg: 'Registration successful',
      token,
      user: { username: newUser.username, id: newUser._id }
     });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      'YOUR_SECRET_KEY', // Replace with your secret string, should be stored in environment variable
      { expiresIn: '1d' }
    );

    // Return token and user info (do not return password)
    res.status(200).json({
      msg: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        registerDate: user.registerDate,
        // ... add other fields if needed
      },
      token
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// Start challenge
exports.startChallenge = async (req, res) => {
  try {
    const { username } = req.body;

    // Update challengeStart to current time
    const user = await User.findOneAndUpdate(
      { username },
      { challengeStart: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ msg: 'Challenge started', user });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user; // đã được middleware auth gán
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Lấy streak
    const streak = await Streak.findOne({ userId: user._id });
    // Lấy milestones progress
    const milestoneProgress = await Milestone.findOne({ userId: user._id });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      challengeStartDate: user.challengeStartDate || null,
      currentStreak: streak?.currentStreak || 0,
      bestStreak: streak?.bestStreak || 0,
      relapseCount: streak?.relapseCount || 0,
      milestones: milestoneProgress?.milestones || [] 
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};