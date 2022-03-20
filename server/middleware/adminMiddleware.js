const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const checkAdmin = asyncHandler(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = await jwt.verify(token, JWT_SECRET_KEY);

            const profile = await Profile.findOne({ user: decoded.id });

            if (profile.role != 'admin') {
                res.status(401)
                throw new Error('Not Authorized to process request');
            }
            next();
        } catch (err) {
            res.status(401);
            throw new Error(err.message);
        }
    }
    else {
        res.status(401);
        throw new Error('Not Authorized, No token Found');
    }
})

module.exports = { checkAdmin };