const streakController = require('../controllers/streakDataController');
const auth = require('../middleware/auth');

const streakRoute = (app) => {
    app.get("/streak", auth, streakController.getStreak);
    app.post("/streak/increase", auth, streakController.increaseStreak);
    app.get("/streak/viewstreakbyid/:id", auth, streakController.getStreakById);
    app.post("/streak/relapse", auth, streakController.relapseStreak);
};

module.exports = streakRoute;
