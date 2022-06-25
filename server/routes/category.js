const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const { checkAdmin } = require("../middleware/adminMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get All Category
router.get('/category', categoryController.getCategory);

// Add New Category
router.post('/category', authMiddleware, checkAdmin, categoryController.addCategory);

// Update a Category Value
router.patch('/category/:id', authMiddleware, checkAdmin, categoryController.updateCategory);

// Delete a Category Value
router.delete('/category/:id', authMiddleware, checkAdmin, categoryController.deleteCategory);

module.exports = router;