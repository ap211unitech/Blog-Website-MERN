const router = require("express").Router();
const profileController = require("../controllers/profileController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get my profile
router.get('/profile/me', authMiddleware, profileController.getMyProfile);

// View any profile
router.post('/profile/view/:id', profileController.viewProfile);

// Follow a profile
router.get('/profile/follow/:id', authMiddleware, profileController.followProfile);

module.exports = router;