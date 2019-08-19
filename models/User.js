let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({//This is how you create a user schema in mongodb
    name: String,
    email: String,
    username: String,
    password: String
});

let User = mongoose.model('User', userSchema);//This is how you create model in mongodb
module.exports = User;