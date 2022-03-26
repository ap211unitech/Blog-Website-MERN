const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const blogController = require("../controllers/blogController");

// Get Latest Blogs
router.get('/blog/popular', blogController.getLatestBlogs);

// Get Blog of a user
router.get('/blog/:userId', blogController.getBlog);

// Write blog
router.post('/blog/write', authMiddleware, blogController.writeBlog);

// Edit blog
router.post('/blog/edit/:id', authMiddleware, blogController.editBlog);

module.exports = router;