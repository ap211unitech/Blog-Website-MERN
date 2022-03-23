const router = require("express").Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Register/Login through form
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/googlesignin', authController.googleSignIn);

// Activate Account
router.get('/auth/activate/:token', authMiddleware, authController.activateAccount);
router.get('/auth/send-activation-link', authMiddleware, authController.sendActivationLink);

// Sends Email For Forgot Password
router.post('/auth/forgotpassword', authController.forgotPassword);
router.post('/auth/resetpassword/:token', authController.resetPassword);

// Change Password when user is logged in
router.post('/auth/change-password', authMiddleware, authController.changePassword)

module.exports = router;