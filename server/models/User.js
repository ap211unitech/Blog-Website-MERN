const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must1 not be empty'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email can not be empty'],
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isActivated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema);