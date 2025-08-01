const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const userRoute = (app) => {
    app.post("/user/register",userController.registerUser)
    app.post("/user/login", userController.loginUser)
    app.post("/user/challengestart", auth, userController.startChallenge)
    app.get("/user/profile", auth, userController.getProfile)
}

module.exports = userRoute;