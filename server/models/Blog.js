const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    
}, { timestamps: true });

module.exports = mongoose.model('blog', BlogSchema);