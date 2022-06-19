const asyncHandler = require("express-async-handler");

const Profile = require("../models/Profile");
const User = require("../models/User");
const Blog = require("../models/Blog");

// @Desc    Convert a user to admin or admin to user
// @Route   POST /admin/toggleRole
// @Access  Private
const toggleRole = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Check if userId and loggedInUser are same
    if (userId.toString() === req.user._id.toString()) {
        res.status(400)
        throw new Error('You can not change your role')
    }

    // Check if user exists
    const userExists = await User.findById(userId);

    if (!userExists) {
        res.status(400)
        throw new Error('No such user exists');
    }

    // Find profile
    const profile = await Profile.findOne({ user: userId });
    if (profile.role == 'user') {
        profile.role = 'admin';
    }
    else if (profile.role == 'admin') {
        profile.role = 'user';
    }
    await profile.save();

    res.status(200).json({ msg: 'Role Toggled' });

})

// @Desc    Toggle isBlocked property
// @Route   POST /admin/toggleBlock
// @Access  Private
const toggleBlock = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Check if userId and loggedInUser are same
    if (userId.toString() === req.user._id.toString()) {
        res.status(400)
        throw new Error('You can not block yourself')
    }

    // Check if user exists
    const userExists = await User.findById(userId);

    if (!userExists) {
        res.status(400)
        throw new Error('No such user exists');
    }

    // Find profile
    const profile = await Profile.findOne({ user: userId });
    profile.isBlocked = !profile.isBlocked;
    await profile.save();

    res.status(200).json({ msg: 'Block property Toggled' });

})

// @Desc    Get All users list
// @Route   POST /admin/getAllUsers
// @Access  Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    let responseArr = [];

    for (let i = 0; i < users.length; i++) {
        let currUser = { ...users[i]._doc };
        currUser['profile'] = await Profile.findOne({ user: users[i]._id });
        currUser['blogs'] = await Blog.find({ user: users[i]._id });
        responseArr.push(currUser);
    }
    res.status(200).json(responseArr);

})

module.exports = {
    toggleRole,
    toggleBlock,
    getAllUsers
};