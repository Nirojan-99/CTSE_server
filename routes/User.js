const Router = require("express").Router;
const router = Router();
const user = require("../Controller/userController");

router.post("/login", user.login);
router.post("/register", user.register);
router.post("/validate", user.sendOTP);
router.post("/otp", user.checkOTP);
router.post("/password", user.resetPass);

module.exports = router;
