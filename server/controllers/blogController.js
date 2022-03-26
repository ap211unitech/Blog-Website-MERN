const asyncHandler = require("express-async-handler");

const Profile = require("../models/Profile");
const Blog = require("../models/Blog");

// @Desc    Get latest blogs
// @Route   GET /blog/latest
// @Access  Public
const getLatestBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ 'updatedAt': -1 }).limit(10);
    res.status(200).json(blogs);
})


// @Desc    Get blogs of a user
// @Route   GET /blog
// @Access  Private
const getBlog = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ user: req.params.userId });
    res.status(200).json(blogs);
})

// @Desc    Write a new blog
// @Route   POST /blog/write
// @Access  Private
const writeBlog = asyncHandler(async (req, res) => {

    const { title, desc, coverPhoto, content } = req.body;

    // Check if profile exists
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        res.status(400)
        throw new Error('No such user profile exists. Hence, Blog could not be posted');
    }

    const newBlog = new Blog({
        user: req.user._id,
        profile: profile._id,
        title,
        desc,
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
    writeBlog,
    editBlog,
    getLatestBlogs
}