const asyncHandler = require("express-async-handler");
const { isValidJSON } = require("../utils/helpers");

const User = require("../models/User");
const Profile = require("../models/Profile");


// @Desc    Get my Profile
// @Route   /profile/me
// @Access  Private
const getMyProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such profile exists' }));
    }
    res.status(200).json(profile);
})

module.exports = {
    getMyProfile
}