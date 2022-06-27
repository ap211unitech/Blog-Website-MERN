const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const blogController = require("../controllers/blogController");

// Get Latest Blogs
router.get('/blog/latest', blogController.getLatestBlogs);

// Get Blogs of a categoryId
router.get('/blog/:categoryId', blogController.getBlogsByCategoryId);

// Get Blog of a user
router.get('/blog/user/:userId', blogController.getBlog);

// Get Blog of a BlogID
router.post('/blog/single/:blogId', blogController.getBlogByBlogID);

// Like a Blog 
router.post('/blog/like/:blogId', authMiddleware, blogController.likeBlogByBlogID);

// DisLike a Blog 
router.post('/blog/dislike/:blogId', authMiddleware, blogController.dislikeBlogByBlogID);

// Comment on a Blog 
router.post('/blog/comment/:blogId', authMiddleware, blogController.commentBlogByBlogID);

// Delete Comment on a Blog 
router.delete('/blog/comment/:blogId/:commentId', authMiddleware, blogController.deleteCommentBlogByBlogID);

// Write blog
router.post('/blog/write', authMiddleware, blogController.writeBlog);

// Edit blog
router.post('/blog/edit/:id', authMiddleware, blogController.editBlog);

// Delete blog
router.delete('/blog/delete/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;