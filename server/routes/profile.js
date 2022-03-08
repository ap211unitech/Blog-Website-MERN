const router = require("express").Router();
const profileController = require("../controllers/profileController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get my profile
router.get('/profile/me', authMiddleware, profileController.getMyProfile);

module.exports = router;