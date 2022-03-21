const asyncHandler = require("express-async-handler");
const { isValidJSON } = require("../utils/helpers");

const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const User = require("../models/User");
const Profile = require("../models/Profile");


// @Desc    Get my Profile
// @Route   GET /profile/me
// @Access  Private
const getMyProfile = asyncHandler(async (req, res) => {
    // Finding and populating some required entries
    const profile = await Profile.findOne({ user: req.user._id })
        .populate({
            path: 'following',
            populate: {
                path: 'user',
            }
        })
        .populate({
            path: 'following',
            populate: {
                path: 'profile',
            }
        })
        .populate({
            path: 'followers',
            populate: {
                path: 'user',
            }
        })
        .populate({
            path: 'followers',
            populate: {
                path: 'profile',
            }
        })
        .populate({
            path: 'viewedBy',
            populate: {
                path: 'user',
            }
        })
        .populate({
            path: 'viewedBy',
            populate: {
                path: 'profile',
            }
        });
    if (!profile) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such profile exists' }));
    }
    res.status(200).json(profile);
})

// @Desc    View any user Profile
// @Route   POST /profile/view/:id
// @Access  Public
const viewProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.id);

    // Check if profile exists
    if (!profile) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such profile exists' }));
    }

    // Find user corresposing to that profile
    const user = await User.findById(profile.user);

    if (req.body.token) {
        // Check if user is logged in
        try {
            const token = req.body.token;
            const decoded = await jwt.verify(token, JWT_SECRET_KEY);

            // Check if already followed
            const flag = profile.viewedBy.find(e => e.user.toString() === decoded.id)

            if (!flag) {

                const loggedInUserProfile = await Profile.findOne({ user: decoded.id });

                profile.viewedBy.unshift({
                    user: decoded.id.toString(),
                    profile: loggedInUserProfile._id
                });
                await profile.save();
            }

        } catch (err) { console.log(err) }
    }

    // Populating required entries
    const newProfile = await Profile.findById(req.params.id).populate({
        path: 'following',
        populate: {
            path: 'user',
        }
    })
        .populate({
            path: 'following',
            populate: {
                path: 'profile',
            }
        })
        .populate({
            path: 'followers',
            populate: {
                path: 'user',
            }
        })
        .populate({
            path: 'followers',
            populate: {
                path: 'profile',
            }
        })
        .populate({
            path: 'viewedBy',
            populate: {
                path: 'user',
            }
        })
        .populate({
            path: 'viewedBy',
            populate: {
                path: 'profile',
            }
        });

    res.status(200).json({ profile: newProfile, user });
})

// @Desc    Follow any user Profile
// @Route   POST /profile/follow/:id
// @Access  Private
const followProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.id);
    // Check if profile exists
    if (!profile) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such profile exists' }));
    }

    if (profile.user.toString() === req.user._id.toString()) {
        res.status(400)
        throw new Error('You can not follow your self');
    }

    // Check if already followed
    const flag = profile.followers.find(e => e.user.toString() === req.user._id.toString());

    if (!flag) {
        const loggedInUserProfile = await Profile.findOne({ user: req.user._id });
        profile.followers.unshift({
            user: req.user._id.toString(),
            profile: loggedInUserProfile._id
        });
        loggedInUserProfile.following.unshift({
            user: profile.user.toString(),
            profile: req.params.id
        })
        await profile.save();
        await loggedInUserProfile.save();
    }
    else {
        res.status(400)
        throw new Error('You already followed this profile')
    }

    res.status(200).json({ profile });
})

module.exports = {
    getMyProfile,
    viewProfile,
    followProfile
}