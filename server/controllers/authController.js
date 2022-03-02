const asyncHandler = require("express-async-handler");
const { validateRegisterInput } = require("../utils/validators");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const User = require("../models/User");

// @Desc Public
// @Route /auth/register
// @Access Public
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
        throw new Error('User Already exists')
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
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    });
})

// @Desc Public
// @Route /auth/login
// @Access Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
        res.status(400)
        throw new Error('No such user exists')
    }

    // Verify Password
    const isMatch = await bcryptjs.compare(password, userExists.password);
    if (!isMatch) {
        res.status(400)
        throw new Error('Incorrect Password')
    }

    res.json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        token: generateToken(userExists._id)
    });
})

const generateToken = (id) => {
    const payload = { id };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '365d' })
}

module.exports = {
    register,
    login
}