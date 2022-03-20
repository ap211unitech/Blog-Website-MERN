const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    name: {
        type: String,
        required: true,
        maxlength: 30
    }
}, { timestamps: true });

module.exports = mongoose.model('category', CategorySchema);