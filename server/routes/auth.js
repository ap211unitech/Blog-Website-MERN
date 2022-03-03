const router = require("express").Router();
const authController = require("../controllers/authController");

// Register/Login through form
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Activate Account
router.get('/auth/activate/:token', authController.activateAccount);

// Sends Email For Forgot Password
router.post('/auth/forgotpassword', authController.forgotPassword);
router.post('/auth/resetpassword/:token', authController.resetPassword);

module.exports = router;