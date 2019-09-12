const express = require('express');
const router = express.Router({mergeParams: true}); //:id of Taco will not be passed to comment --> need this to merge Taco :id to Comment
const Taco = require('../models/taco.js');
const Comment = require('../models/comment.js');
const middlewareObj = require('../middleware/index.js')

// Comments New
router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
    Taco.findById(req.params.id, (err, taco) => {
        if(err){
            console.log(err)
        } else {
            res.render('comments/new', {taco: taco})
        }
    });
});

// Comments Create
router.post('/', middlewareObj.isLoggedIn, (req, res) => {
    Taco.findById(req.params.id, (err, taco) => {
        if(err){
            console.log(err)
            res.redirect('/tacors')
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err)
                } else {
                    comment.user.id = req.user._id
                    comment.user.username = req.user.username
                    comment.save();
                    
                    taco.comments.push(comment)
                    taco.save()
                    req.flash('success', 'Comment added')
                    res.redirect(`/tacors/${taco._id}`)
                }
            })
        };
    });
});

// Edit Comments
router.get('/:comment_id/edit', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            console.log(err)
        } else {
            res.render('comments/edit', {taco_id: req.params.id, comment: foundComment})
        }
    }) 
});
router.put('/:comment_id', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            console.log(err)
            res.redirect("back")
        } else {
            req.flash('success', 'Updated comment')
            res.redirect(`/tacors/${req.params.id}`)
        }
    })
});

// DELETE COMMENT
router.delete('/:comment_id', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.send(`Couldn't delete Comment`)
        } else {
            req.flash('success', 'Comment deleted')
            res.redirect('/tacors/' + req.params.id)
        }
    })
});

module.exports = router;