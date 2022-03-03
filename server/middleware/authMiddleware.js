const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authMiddleware = asyncHandler(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = await jwt.verify(token, JWT_SECRET_KEY);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (err) {
            res.status(401);
            throw new Error('Not Authorized');
        }
    }
    else {
        res.status(401);
        throw new Error('Not Authorized, No token Found');
    }
})

module.exports = { authMiddleware };