const asyncHandler = require("express-async-handler");

const Profile = require("../models/Profile");
const Blog = require("../models/Blog");
const Category = require("../models/Category");

// @Desc    Get latest blogs
// @Route   GET /blog/latest
// @Access  Public
const getLatestBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().populate('user').populate('profile').populate('category').sort({ 'updatedAt': -1 }).limit(10);
    res.status(200).json(blogs);
})


// @Desc    Get blogs of a user
// @Route   GET /blog/:userId
// @Access  Private
const getBlog = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ user: req.params.userId });
    res.status(200).json(blogs);
})

// @Desc    Get blog of blogId
// @Route   GET /blog/single/:blogId
// @Access  Public
const getBlogByBlogID = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
        res.status(400)
        throw new Error('No such blog found')
    }
    res.status(200).json(blog);
})

// @Desc    Write a new blog
// @Route   POST /blog/write
// @Access  Private
const writeBlog = asyncHandler(async (req, res) => {

    const { title, desc, coverPhoto, content, category } = req.body;

    // Check if profile exists
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(400)
        throw new Error('No such user profile exists. Hence, Blog could not be posted');
    }

    // Check if that category exists
    const categoryExists = await Category.findOne({ _id: category });

    if (!categoryExists) {
        res.status(400)
        throw new Error('No such category exists');
    }

    const newBlog = new Blog({
        user: req.user._id,
        profile: profile._id,
        title,
        desc,
        category,
        coverPhoto,
        content
    })

    await newBlog.save();

    res.status(201).json({ blog: newBlog });

})

// @Desc    Edit a blog
// @Route   POST /blog/edit/:id
// @Access  Private
const editBlog = asyncHandler(async (req, res) => {

    const { title, desc, coverPhoto, content } = req.body;

    // Check if blog exists
    const blogExists = await Blog.findById(req.params.id);

    if (!blogExists) {
        res.status(400)
        throw new Error('Blog does not exists');
    }

    // Check if user is same 
    if (req.user._id.toString() !== blogExists.user.toString()) {
        res.status(400)
        throw new Error('Not authorized to edit this blog');
    }

    blogExists.title = title;
    blogExists.desc = desc;
    blogExists.coverPhoto = coverPhoto;
    blogExists.content = content;

    await blogExists.save();

    res.status(200).json({ blog: blogExists });

})

module.exports = {
    getBlog,
    getBlogByBlogID,
    writeBlog,
    editBlog,
    getLatestBlogs
}