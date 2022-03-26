const asyncHandler = require("express-async-handler");
const { validateRegisterInput } = require("../utils/validators");
const bcryptjs = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { isValidJSON } = require("../utils/helpers");
const { activationEmail, forgotPasswordEmail } = require("../utils/mail");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_RESET_KEY = process.env.JWT_RESET_KEY
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID


const User = require("../models/User");
const Profile = require("../models/Profile");

// @Desc    Register New user through formdata
// @Route   /auth/register
// @Access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validating Data
    const validate = validateRegisterInput(email, name, password);

    if (!validate.valid) {
        res.status(400)
        throw new Error(JSON.stringify(validate.errors))
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'User Already exists' }))
    }

    // Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Save user in database
    const user = new User({
        name,
        email,
        password: hashedPassword
    })

    await user.save();

    // Generate Token
    const token = generateToken(user._id);

    // Send Account Confirmation/Activation Email 
    activationEmail({ to: user.email.trim(), token });

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token
    });

    // Create profile for user
    const profile = new Profile({
        user: user._id,
    })
    await profile.save();

})

// @Desc    Login User through formdata
// @Route   /auth/login
// @Access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such user exists' }))
    }

    // Verify Password
    const isMatch = await bcryptjs.compare(password, userExists.password);
    if (!isMatch) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'Incorrect Password' }))
    }

    // Check if user is not blocked
    const profile = await Profile.findOne({ user: userExists._id });
    if (profile.isBlocked) {
        res.status(400)
        throw new Error('You have been blocked.')
    }

    res.json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        createdAt: userExists.createdAt,
        updatedAt: userExists.updatedAt,
        token: generateToken(userExists._id)
    });
})

// @Desc    Google Sign In / Sign Up
// @Route   /auth/googlesignin
// @Access  Public
const googleSignIn = asyncHandler(async (req, res) => {
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

    // Google Token
    const { idToken } = req.body;

    const response = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID
    });

    const { name, email, picture, email_verified } = response.getPayload();

    if (email_verified) {
        // Find Email in User Model
        const userExists = await User.findOne({ email });

        if (userExists) {

            // Check if user is not blocked
            const profile = await Profile.findOne({ user: userExists._id });
            if (profile.isBlocked) {
                res.status(400)
                throw new Error('You have been blocked.')
            }

            res.status(200).json({
                _id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                createdAt: userExists.createdAt,
                updatedAt: userExists.updatedAt,
                token: generateToken(userExists._id)
            })
        }
        else {
            const randomPassword = uuidv4();

            // Hash Password
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(randomPassword, salt);

            const newUser = new User({
                name,
                email,
                password: hashedPassword
            })

            await newUser.save();

            // Create profile for user
            const profile = new Profile({
                user: newUser._id,
                profileUrl: picture
            })
            await profile.save();

            const token = generateToken(newUser._id);

            res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
                token
            })

            // Send Account Confirmation/Activation Email 
            activationEmail({ to: newUser.email.trim(), token });

        }
    }
    else {
        res.status(400)
        throw new Error('Your email is not verified according to google');
    }
})

// @Desc    Activate User Account
// @Route   /auth/activate/:token
// @Access  Public
const activateAccount = asyncHandler(async (req, res) => {

    //Token
    const token = req.params.token;

    try {
        const decoded = await jwt.verify(token, JWT_SECRET_KEY);
        const userExists = await User.findById(decoded.id).select('-password');

        if (!userExists) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'Invalid Link' }))
        }

        if (req.user._id.toString() !== userExists._id.toString()) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'Not authorized' }))
        }

        // Find Profile of that user
        const profile = await Profile.findOne({ user: userExists._id });

        if (profile.isActivated) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'User account already activated' }))
        }

        // Set isActivated Property to true
        profile.isActivated = true;
        await profile.save();

        res.status(200).json(profile);

    } catch (err) {
        const errMsg = isValidJSON(err.message) ? JSON.parse(err.message) : { err: 'Invalid/Expired Link' };
        res.status(400)
        throw new Error(JSON.stringify(errMsg));
    }
})

// @Desc    Forgot Password Link ( Email Sending )
// @Route   /auth/forgotpassword
// @Access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user with that email exists
    const userExists = await User.findOne({ email });

    if (!userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such user exists' }))
    }

    // Generate token
    const payload = { id: userExists._id };
    const token = jwt.sign(payload, JWT_RESET_KEY, { expiresIn: '10m' })

    // Send Reset Password Email
    forgotPasswordEmail({ to: userExists.email, token })

    res.status(200).json({ msg: 'Reset Password Link sent' });
})

// @Desc    Reset Password ( After Mail Sent )
// @Route   /auth/resetpassword/:token
// @Access  Public
const resetPassword = asyncHandler(async (req, res) => {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.trim().length < 6) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'Password must be length of greater than 6' }))
        }

        const decoded = await jwt.verify(token, JWT_RESET_KEY);

        // Check if user exists for that id 
        const userExists = await User.findById(decoded.id);

        if (!userExists) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'No such user exists' }))
        }

        // Hash Password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        userExists.password = hashedPassword;
        await userExists.save();

        res.status(200).json({ msg: 'Password reset successfully' });

    } catch (err) {
        const errMsg = isValidJSON(err.message) ? JSON.parse(err.message) : { err: 'Invalid/Expired Link' };
        res.status(400)
        throw new Error(JSON.stringify(errMsg));
    }
})


// @Desc    Send Activation Link If Normal Activation Link Expires
// @Route   /auth/send-activation-link
// @Access  Private
const sendActivationLink = asyncHandler(async (req, res) => {
    // Check if user find with that id
    const userExists = await User.findById(req.user._id);

    if (!userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such user exists' }))
    }

    const token = generateToken(req.user._id);
    activationEmail({ to: userExists.email, token })

    res.status(200).json({ msg: 'Activation Link Sent to your email' });

})

// @Desc    Change Password
// @Route   /auth/change-password
// @Access  Private
const changePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    //Find user if exists
    const userExists = await User.findById(req.user._id);

    if (!userExists) {
        res.status(400)
        throw new Error('No such user exists');
    }

    if (userExists._id.toString() !== req.user._id.toString()) {
        res.status(400)
        throw new Error('You are not authorized to process this request');
    }

    // Verify Password
    const isMatch = await bcryptjs.compare(oldPassword, userExists.password);
    if (!isMatch) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'Old Password is incorrect' }))
    }

    // Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    userExists.password = hashedPassword;
    await userExists.save();

    res.status(200).json({ msg: 'Password Changed' });

})

// Generate Token
const generateToken = (id) => {
    const payload = { id };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' })
}

module.exports = {
    register,
    login,
    googleSignIn,
    activateAccount,
    sendActivationLink,
    forgotPassword,
    resetPassword,
    changePassword
}