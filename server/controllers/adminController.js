const asyncHandler = require("express-async-handler");

const Profile = require("../models/Profile");
const User = require("../models/User");

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

module.exports = {
    toggleRole,
    toggleBlock
};