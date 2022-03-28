const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile',
        required: true
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
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
                ref: 'user',
                required: true
            },
            profile: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'profile',
                required: true
            },
        }
    ],
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            }
        }
    ],
    dislikes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            profile: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'profile',
                required: true
            },
            text: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('blog', BlogSchema);