const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
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
    ],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
})

module.exports = mongoose.model('profile', ProfileSchema);