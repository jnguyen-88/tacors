const express = require('express');
const router = express.Router();
const Taco = require('../models/taco.js');
const Comment = require('../models/comment.js');
const middlewareObj = require('../middleware/index.js')

//================
// Routes
//================
// Gets all Tacos
router.get('/', (req, res) => {
    Taco.find({}, (err, tacos) => {
        if(!tacos){
            console.log('no tacos found')
        } else {
            res.render('tacos/index.ejs', {tacos: tacos, currentUser: req.user, message: req.flash('signupMessage')}) // Passport checks req.user obj. if no req.user it returns 'undef'
        }
    });
});

// Create Form
// Create Comments
router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
    res.render('tacos/new.ejs')
});
router.post('/', middlewareObj.isLoggedIn, (req, res) => {
    var user = {
        id: req.user._id,
        username: req.user.username
    }
    var name = req.body.taco.name
    var img = req.body.taco.img
    var address = req.body.taco.address
    var state = req.body.taco.state
    var zip = req.body.taco.zip
    var city = req.body.taco.city
    var newTaco = {name: name, img, address, state, zip, city}
    Taco.create(newTaco, (err, taco) => {
        if(err){
            console.log(err)
            req.flash("error", err._message)
            res.redirect('/tacors')
        } else {
            res.redirect('/tacors')
        }
    });
});

// Show 1 Restaurant
router.get('/:id', (req, res) => {
    Taco.findById(req.params.id).populate("comments").exec((err, taco) => {
        if(err){
            console.log(err)
        } else {
            res.render('tacos/show.ejs', {taco: taco})
        }
    })
});

// Edit Restaurant
router.get('/:id/edit', middlewareObj.checkTacoOwnership, (req, res) => {
    Taco.findById(req.params.id, (err, taco) => {
        res.render('tacos/edit.ejs', {taco: taco})
    })
});
router.put('/:id', middlewareObj.checkTacoOwnership, (req, res) => {
    Taco.findByIdAndUpdate(req.params.id, req.body.taco, (err, taco) => {
        if(err){
            console.log(err)
        } else {
            res.redirect('/tacors/' + req.params.id)
        }
    })
});

router.delete('/:id', middlewareObj.checkTacoOwnership, (req, res) => {
    Taco.findById(req.params.id, (err, taco, next) => {
        if(err) return next(err);

        taco.remove()
        res.redirect('/tacors')
    })
});

module.exports = router;