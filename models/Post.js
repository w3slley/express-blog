const mongoose = require('mongoose')


postSchema = new mongoose.Schema({
    title: String,
    author: String,
    content: String,
    date: String
})

let Post = mongoose.model('Post', postSchema)
module.exports = Post