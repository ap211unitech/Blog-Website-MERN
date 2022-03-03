const asyncHandler = require("express-async-handler");
const { validateRegisterInput } = require("../utils/validators");
const bcryptjs = require("bcryptjs");
const { activationEmail } = require("../utils/mail");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const User = require("../models/User");

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

    // Send Confirmation/Activation Email 
    activationEmail({ to: user.email.trim(), token });

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
    });
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

    res.json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        token: generateToken(userExists._id)
    });
})

// @Desc    Activate User Account
// @Route   /auth/activate/:token
// @Access  Public
const activateAccount = asyncHandler(async (req, res) => {
    //Token
    const token = req.params.token;

    if (!token) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'Not able to activate account, No token found' }))
    }

    const decoded = await jwt.verify(token, JWT_SECRET_KEY);

    if (!decoded.id) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'Invalid Link' }))
    }

    const userExists = await User.findById(decoded.id).select('-password');

    if (!userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'Invalid Link' }))
    }

    if (userExists.isActivated) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'User account already activated' }))
    }

    // Set isActivated Property to true
    userExists.isActivated = true;
    await userExists.save();

    res.json(userExists);

})

// Generate Token
const generateToken = (id) => {
    const payload = { id };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' })
}

module.exports = {
    register,
    login,
    activateAccount
}