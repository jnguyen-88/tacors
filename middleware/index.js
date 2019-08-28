const express = require('express');
const passport = require('passport');
const Taco = require('../models/taco.js');
const Comment = require('../models/comment.js');

const middlewareObj = {
    checkCommentOwnership: function(req, res, next){
        if(req.isAuthenticated()){ // checks if a user is logged in
            Comment.findById(req.params.comment_id, (err, comment) => {
                if(err){
                    res.redirect("back")
                } else {
                    if(comment.user.id.equals(req.user._id)){
                        next()
                    } else {
                        res.redirect("back")
                    }
                }
            })
        } else {
            res.redirect("back")
        }
    },
    checkTacoOwnership: function(req, res, next) {
        if(req.isAuthenticated()){ // checks if a user is logged in
            Taco.findById(req.params.id, (err, taco) => {
                if(err){
                    res.redirect("back")
                } else {
                    if(taco.user.id.equals(req.user._id)){
                        next()
                    } else {
                        res.redirect("back")
                    }
                }
            })
        } else {
            res.redirect("back")
        }
    },
    isLoggedIn: function (req, res, next) {
        if(req.isAuthenticated()){
            return next()
        } else {
            res.redirect('/login')
        }
    }
};


module.exports = middlewareObj;