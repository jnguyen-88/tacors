const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose); // adds passport methods to User

const User = mongoose.model("User", userSchema);

module.exports = User;
