const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { checkAdmin } = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");

// Toggle Role, user to admin or admin to user
router.post('/toggleRole', authMiddleware, checkAdmin, adminController.toggleRole)

// Toggle isBlocked property
router.post('/toggleBlock', authMiddleware, checkAdmin, adminController.toggleBlock)

module.exports = router;