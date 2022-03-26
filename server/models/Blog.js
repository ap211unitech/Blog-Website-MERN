const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    title: {
        type: String,
        required: true,
        maxlength: 170
    },
    desc: {
        type: String,
        required: true,
    },
    coverPhoto: {
        type: String,
        required: true
    },
    content: [
        {
            image: {
                type: String,
                required: true
            },
            desc: {
                type: String,
                required: true,
            }
        }
    ],
    viewedBy: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            profile: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'profile'
            },
        }
    ],
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    dislikes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            profile: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'profile'
            },
            text: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('blog', BlogSchema);