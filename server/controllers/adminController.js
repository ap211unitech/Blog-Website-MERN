const asyncHandler = require("express-async-handler");

const Profile = require("../models/Profile");
const User = require("../models/User");
const Blog = require("../models/Blog");
const { userRoleChangedEmail, userBlockEmail } = require("../utils/mail");

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
    const userExists = await User.findById(userId).select('-password');

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

    // Send email when user role changed
    userRoleChangedEmail({ to: userExists.email, isAdminNow: profile.role === 'admin' });

    let response = { ...userExists._doc };
    response['profile'] = profile;
    response['blogs'] = await Blog.find({ user: userId }).populate('profile').populate('category');

    res.status(200).json(response);
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
    const userExists = await User.findById(userId).select('-password');

    if (!userExists) {
        res.status(400)
        throw new Error('No such user exists');
    }

    // Find profile
    const profile = await Profile.findOne({ user: userId });
    profile.isBlocked = !profile.isBlocked;
    await profile.save();

    // Send email when user gets block/unblock
    userBlockEmail({ to: userExists.email, isBlockNow: profile.isBlocked })

    let response = { ...userExists._doc };
    response['profile'] = profile;
    response['blogs'] = await Blog.find({ user: userId }).populate('profile').populate('category');

    res.status(200).json(response);

})

// @Desc    Get All users list
// @Route   GET /admin/getAllUsers
// @Access  Private
const getAllUsers = asyncHandler(async (req, res) => {
    const [users, profiles, blogs] = await Promise.all([
        User.find().select('-password'),
        Profile.find(),
        Blog.find().select('_id user')
    ]);

    let responseArr = [];

    for (let i = 0; i < users.length; i++) {
        let currUser = { ...users[i]._doc };
        currUser['profile'] = profiles.find(p => p.user.toString() === users[i]._id.toString());
        currUser['blogs'] = blogs.filter(b => b.user.toString() === users[i]._id.toString());
        responseArr.push(currUser);
    }
    res.status(200).json(responseArr);

})

// @Desc    Get user from userId 
// @Route   POST /admin/getUserDetailsByUserId
// @Access  Private
const getUserDetailsByUserID = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const userExists = await User.findById(userId).select('-password');

    if (!userExists) {
        res.status(400)
        throw new Error('No such user exists');
    }

    let response = { ...userExists._doc };
    response['profile'] = await Profile.findOne({ user: userId });;
    response['blogs'] = await Blog.find({ user: userId }).populate('profile').populate('category');

    res.status(200).json(response);
})

module.exports = {
    toggleRole,
    toggleBlock,
    getAllUsers,
    getUserDetailsByUserID
};