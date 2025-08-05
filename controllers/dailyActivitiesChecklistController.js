const CheckList = require('../models/dailyActivitiesChecklistModel');

// Create checklist
exports.createChecklist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, items, category } = req.body; // Thêm category
    const checklist = await CheckList.create({ userId, date, items, category });
    res.status(201).json(checklist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all checklists of current user
exports.getChecklists = async (req, res) => {
  try {
    const userId = req.user._id;
    const checklists = await CheckList.find({ userId }).sort({ date: -1 });
    res.json(checklists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single checklist by id
exports.getChecklistById = async (req, res) => {
  try {
    const userId = req.user._id;
    const checklist = await CheckList.findOne({ _id: req.params.id, userId });
    if (!checklist) return res.status(404).json({ error: 'Checklist not found' });
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update checklist (add/remove/update items)
exports.updateChecklist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, date, category } = req.body; // Thêm category
    const checklist = await CheckList.findOneAndUpdate(
      { _id: req.params.id, userId },
      { items, date, category },
      { new: true }
    );
    if (!checklist) return res.status(404).json({ error: 'Checklist not found' });
    res.json(checklist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete checklist
exports.deleteChecklist = async (req, res) => {
  try {
    const userId = req.user._id;
    const checklist = await CheckList.findOneAndDelete({ _id: req.params.id, userId });
    if (!checklist) return res.status(404).json({ error: 'Checklist not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
