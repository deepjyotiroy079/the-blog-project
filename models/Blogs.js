const mongoose = require('mongoose');
const User = require('../models/Users');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;