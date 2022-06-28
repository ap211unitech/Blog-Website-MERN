const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const mongoose = require("mongoose");

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

// @Desc    Get Blogs of a categoryId
// @Route   GET /blog/:categoryId
// @Access  Public
const getBlogsByCategoryId = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ category: req.params.categoryId }).populate('user').populate('profile').populate('category').sort({ 'updatedAt': -1 });
    res.status(200).json(blogs);
})

// @Desc    Get blogs of a user
// @Route   GET /blog/user/:userId
// @Access  Public
const getBlog = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ user: req.params.userId }).populate('user').populate('profile').populate('category');
    res.status(200).json(blogs);
})

// @Desc    Get blog of blogId
// @Route   POST /blog/single/:blogId
// @Access  Public
const getBlogByBlogID = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.blogId).populate('user').populate('profile').populate('category').populate({
        path: 'comments',
        populate: {
            path: 'profile',
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'user',
        }
    });

    if (!blog) {
        res.status(400)
        throw new Error('No such blog found')
    }

    if (req.body && req.body.token) {
        // Check if user is logged in
        try {
            const token = req.body.token;
            const decoded = await jwt.verify(token, JWT_SECRET_KEY);

            // Check if already followed
            const flag = blog.viewedBy.find(e => e.user.toString() === decoded.id)

            if (!flag) {
                const loggedInUserProfile = await Profile.findOne({ user: decoded.id });

                blog.viewedBy.unshift({
                    user: decoded.id,
                    profile: loggedInUserProfile._id
                })

                await blog.save();
            }
        } catch (err) {
            console.log(err)
            res.status(400)
            throw new Error('No such profile exists');
        }
    }

    res.status(200).json(blog);
})


// @Desc    Like a single blog
// @Route   POST /blog/like/:blogId
// @Access  Private
const likeBlogByBlogID = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.blogId).populate('user').populate('profile').populate('category').populate({
        path: 'comments',
        populate: {
            path: 'profile',
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'user',
        }
    });
    if (!blog) {
        throw new Error('No such blog exists');
    }

    // Check if already liked
    const alreadyLiked = blog.likes.find(e => e.user.toString() === req.user._id.toString());

    if (alreadyLiked) {
        blog.likes.remove(alreadyLiked);
        await blog.save();
    }
    else {
        blog.likes.unshift({
            user: req.user._id
        })
        await blog.save();
    }

    res.status(200).json(blog);

})

// @Desc    DisLike a single blog
// @Route   POST /blog/dislike/:blogId
// @Access  Private
const dislikeBlogByBlogID = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.blogId).populate('user').populate('profile').populate('category').populate({
        path: 'comments',
        populate: {
            path: 'profile',
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'user',
        }
    });
    if (!blog) {
        res.status(400)
        throw new Error('No such blog exists');
    }

    // Check if already liked
    const alreadydisLiked = blog.dislikes.find(e => e.user.toString() === req.user._id.toString());

    if (alreadydisLiked) {
        blog.dislikes.remove(alreadydisLiked);
        await blog.save();
    }
    else {
        blog.dislikes.unshift({
            user: req.user._id
        })
        await blog.save();
    }

    res.status(200).json(blog);

})

// @Desc    Comment on a single blog
// @Route   POST /blog/comment/:blogId
// @Access  Private
const commentBlogByBlogID = asyncHandler(async (req, res) => {

    if (!req.body.text || req.body.text.trim().length == 0) {
        res.status(400)
        throw new Error('Comment should not be empty');
    }

    let blog = await Blog.findById(req.params.blogId).populate('user').populate('profile').populate('category').populate({
        path: 'comments',
        populate: {
            path: 'profile',
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'user',
        }
    });

    if (!blog) {
        res.status(400)
        throw new Error('No such blog exists');
    }

    //  Find Profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(400)
        throw new Error('No such profile exists');
    }

    blog.comments.unshift({
        text: req.body.text,
        user: req.user._id,
        profile: profile._id
    })

    await blog.save();

    const newBlog = await Blog.findById(req.params.blogId).populate('user').populate('profile').populate('category').populate({
        path: 'comments',
        populate: {
            path: 'profile',
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'user',
        }
    });

    res.status(200).json(newBlog);

})

// @Desc    Delete a Comment on a single blog
// @Route   DELETE /blog/comment/:blogId/:commentId
// @Access  Private
const deleteCommentBlogByBlogID = asyncHandler(async (req, res) => {

    let blog = await Blog.findById(req.params.blogId).populate('user').populate('profile').populate('category').populate({
        path: 'comments',
        populate: {
            path: 'profile',
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'user',
        }
    });

    if (!blog) {
        res.status(400)
        throw new Error('No such blog exists');
    }

    // Check if comment exists
    const flag = blog.comments.find(comment => comment._id.toString() === req.params.commentId);
    if (!flag) {
        res.status(400)
        throw new Error('No such comment exists');
    }

    // Check if user ( who wrote the comment ) and loggedInUser are same
    if (flag.user._id.toString() !== req.user._id.toString()) {
        res.status(400)
        throw new Error('Not authorized to delete comment');
    }

    blog.comments.remove({ user: req.user._id, profile: flag.profile._id, text: flag.text, _id: req.params.commentId });

    await blog.save();

    const newBlog = await Blog.findById(req.params.blogId).populate('user').populate('profile').populate('category').populate({
        path: 'comments',
        populate: {
            path: 'profile',
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'user',
        }
    });

    res.status(200).json(newBlog);

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
        title: title.trim(),
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

    const { title, desc, coverPhoto, content, category } = req.body;

    // Check if blog exists
    const blogExists = await Blog.findById(req.params.id);

    if (!blogExists) {
        res.status(400)
        throw new Error('Blog does not exists');
    }

    if (req.body.prime) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(400)
            throw new Error('No such category exists')
        }

        blogExists.title = title;
        blogExists.desc = desc;
        blogExists.coverPhoto = coverPhoto;
        blogExists.content = content;
        blogExists.category = category;

        await blogExists.save();

        return res.status(200).json({ blog: blogExists });
    }

    // Check if user is same 
    if (req.user._id.toString() !== blogExists.user.toString()) {
        res.status(400)
        throw new Error('Not authorized to edit this blog');
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(400)
        throw new Error('No such category exists')
    }

    blogExists.title = title;
    blogExists.desc = desc;
    blogExists.coverPhoto = coverPhoto;
    blogExists.content = content;
    blogExists.category = category;

    await blogExists.save();

    res.status(200).json({ blog: blogExists });

})

// @Desc    Delete a blog
// @Route   DELETE /blog/delete/:id
// @Access  Private
const deleteBlog = asyncHandler(async (req, res) => {
    // Find blog
    const blogExists = await Blog.findById(req.params.id);
    if (!blogExists) {
        res.status(400)
        throw new Error('No such blog exists')
    }

    if (req.body.prime) {
        await Blog.findByIdAndDelete(req.params.id);
        return res.status(200).json({ msg: 'Blog deleted' });
    }

    // Check if who created the blog and loggedIn user are same
    if (req.user._id.toString() !== blogExists.user.toString()) {
        res.status(400)
        throw new Error('Not authorized to process this request')
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Blog deleted' });

})

module.exports = {
    getBlog,
    getBlogsByCategoryId,
    getBlogByBlogID,
    writeBlog,
    editBlog,
    deleteBlog,
    getLatestBlogs,
    likeBlogByBlogID,
    dislikeBlogByBlogID,
    commentBlogByBlogID,
    deleteCommentBlogByBlogID
}