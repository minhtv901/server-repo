const express = require('express');
const router = express.Router();
const journalController = require('../controllers/dailyJournalController');
const auth = require('../middleware/auth'); // middleware xác thực

// CRUD
const journalRoute = (app) => {
    app.post('/journal', auth, journalController.createJournal);
    app.get('/journal', auth, journalController.getJournals);
    app.get('/journal/:id', auth, journalController.getJournalById);
    app.put('/journal/:id', auth, journalController.updateJournal);
    app.delete('/journal/:id', auth, journalController.deleteJournal);
};

module.exports = journalRoute;
