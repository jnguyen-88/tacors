require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const methodOverride = require('method-override');
const Taco = require('./models/taco.js');
const User = require('./models/user.js');
const Comment = require('./models/comment.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
const app = express();

app.use(cookieParser('secret'));
app.use(flash());

const tacoRoutes = require('./routes/tacos.js');
const commentRoutes = require('./routes/comments.js');
const authRoutes = require('./routes/index.js');

const currentUser = (req, res, next) => {
    res.locals.currentUser = req.user //adding it to .locals ensures all routes will get access to currentUser
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next()
};

//================
// Mongoose Config
//================
// mongoose.connect('mongodb://localhost/tacors',{useNewUrlParser: true});
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB")
}).catch(err => {
    console.log("Error", err)
})


//================
// Passport Config
//================
app.use(require("express-session")({
    secret: "Justin is here",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================
// App Config
//================
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Seed Data
const data = [
    {
        name: "Tacos 5",
        img: "https://images.unsplash.com/photo-1556745750-68295fefafc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Blah Blah Blah"
    },
    {
        name: "Tacos Al Pastor",
        img: "https://images.unsplash.com/photo-1556745750-68295fefafc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Blah Blah Blah"
    },
    {
        name: "Tacos Gruedo",
        img: "https://images.unsplash.com/photo-1556745750-68295fefafc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Blah Blah Blah"
    }
]

// Wipe db
const seedDB = () => {
    Taco.deleteMany({}, (err) => {
        if(err){
            console.log(err)
        }
        console.log('db cleaned');

        // data.forEach((seed) => {
        //     Taco.create(seed, (err, taco) => {
        //         if(err){
        //             console.log(err)
        //         } else {
        //             console.log("taco created")
        //             Comment.create(
        //                 {
        //                     text: "This place was delicious",
        //                     user: 'Justin'
        //                 },(err, comment) => {
        //                     if(err){
        //                         console.log(err)
        //                     } else {
        //                         console.log('comment added')
        //                         taco.comments.push(comment)
        //                         taco.save()
        //                     }
        //                 }
        //             );
        //         }
        //     })
        // });
    }
)};

//seedDB();

app.use(currentUser);
app.use('/tacors', tacoRoutes);
app.use('/tacors/:id/comments',commentRoutes);
app.use(authRoutes);

app.all('/', function(req, res){
    req.flash('test', 'it worked');
    res.redirect('/tacors')
  });

const port = 3000;
app.listen(port, () => {
    console.log('Server is  up on Port ' + port)
});