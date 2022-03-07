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
    bio: {
        type: String,
        default: "",
        trim: true
    },
    profileUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    },
    followers: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    following: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    viewedBy: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema);