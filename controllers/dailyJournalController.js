const Journal = require('../models/dailyJournalModel');

// Create a new journal entry
exports.createJournal = async (req, res) => {
  try {
    const { date, note, mood } = req.body;
    const userId = req.user._id; // lấy từ middleware auth

    const journal = await Journal.create({ userId, date, note, mood });
    res.status(201).json(journal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all journals of the current user
exports.getJournals = async (req, res) => {
  try {
    const userId = req.user._id;
    const journals = await Journal.find({ userId }).sort({ date: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single journal by ID
exports.getJournalById = async (req, res) => {
  try {
    const userId = req.user._id;
    const journal = await Journal.findOne({ _id: req.params.id, userId });
    if (!journal) return res.status(404).json({ error: 'Journal not found' });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a journal by ID
exports.updateJournal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { note, mood, date } = req.body;
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId },
      { note, mood, date },
      { new: true }
    );
    if (!journal) return res.status(404).json({ error: 'Journal not found' });
    res.json(journal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a journal by ID
exports.deleteJournal = async (req, res) => {
  try {
    const userId = req.user._id;
    const journal = await Journal.findOneAndDelete({ _id: req.params.id, userId });
    if (!journal) return res.status(404).json({ error: 'Journal not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
