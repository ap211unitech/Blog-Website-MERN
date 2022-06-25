const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { checkAdmin } = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");

// Toggle Role, user to admin or admin to user
router.post('/toggleRole', authMiddleware, checkAdmin, adminController.toggleRole)

// Toggle isBlocked property
router.post('/toggleBlock', authMiddleware, checkAdmin, adminController.toggleBlock)

// Get List of all users
router.get('/getAllUsers', authMiddleware, checkAdmin, adminController.getAllUsers);

// Get User Details from userid
router.post('/getUserDetailsByUserId', authMiddleware, checkAdmin, adminController.getUserDetailsByUserID);

module.exports = router;