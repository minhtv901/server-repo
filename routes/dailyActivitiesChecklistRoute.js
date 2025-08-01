const auth = require('../middleware/auth');
const checklistController = require('../controllers/dailyActivitiesChecklistController');

const checklistRoute = (app) => {
    app.post('/checklist', auth, checklistController.createChecklist);
    app.get('/checklist', auth, checklistController.getChecklists);
    app.get('/checklist/:id', auth, checklistController.getChecklistById);
    app.put('/checklist/:id', auth, checklistController.updateChecklist);
    app.delete('/checklist/:id', auth, checklistController.deleteChecklist);
};

module.exports = checklistRoute;
