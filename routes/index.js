const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');

//================
// Middleware
//================

// MAYBE FIX THIS FILE *******

// const isLoggedIn = (req, res, next) => {
//     if(req.isAuthenticated()){
//         return next()
//     } else {
//         res.redirect('/login')
//     }
// };

//================
// Auth Routes
//================

// Login
router.get('/login', (req, res) => {
    res.render('login.ejs')
});

router.post('/login', passport.authenticate("local", 
    {
        successRedirect: "/tacors",
        failureRedirect: "/login"
    }), function(req, res){}
);

// Register Form
// Sign Up
router.get('/register', (req, res) => {
    res.render('register.ejs')
});
router.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err)
            return res.render('register.ejs')
        }
        passport.authenticate('local')(req, res, ()=> {
            res.redirect('/tacors')
        })
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/tacors');
});

module.exports = router;