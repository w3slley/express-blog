const mongoose = require('mongoose')


postSchema = new mongoose.Schema({
    title: String,
    author_id: String,
    author_name: String,
    content: String,
    date: String
})

let Post = mongoose.model('Post', postSchema)
module.exports = Post