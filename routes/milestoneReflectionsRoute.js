const milestoneController = require('../controllers/milestoneReflectionsController');
const auth = require('../middleware/auth'); // middleware xác thực 

// Xem thành tựu đã đạt/chưa đạt
const milestoneRoute= (app) => {
    app.post('/milestones', auth, milestoneController.checkAndSaveMilestone);
    app.get('/milestones',auth, milestoneController.getMilestones);
};

module.exports = milestoneRoute;
