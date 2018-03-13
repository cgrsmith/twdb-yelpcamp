/*** Dependancies ***/
const express = require("express");
const app = express();
const parser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const sanitizer = require("sanitize-html");
const passport = require("passport");
const LocalStrategy = require("passport-local");

/*** Environment Variables ***/
const port = process.env.PORT || 3000;

/*** Config ***/
app.use(parser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


/*** Models ***/
mongoose.connect("mongodb://localhost:27017/yelpcamp");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
//const seedDB = require("./db-populate"); seedDB(); //RE-SEED DB

/*** Passport Configuration ***/
app.use(require("express-session")({
    secret : "test secret please ignore",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*** Campgrounds Routing ***/
app.get("/", function(req, res) {
    res.redirect("/campgrounds");
});

//INDEX
app.get("/campgrounds", function(req, res) {
    Campground.find({})
        .exec(function(err, dbCampgrounds) {
            if (err) throw err;
            res.render("campgrounds/index", {campgrounds : dbCampgrounds});
    });
});

//NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//CREATE
app.post("/campgrounds", function(req, res) {
    Campground.create(createSanitizedInput(req.body.campground),
    function(err, submission){
        if (err) {
            res.redirect("/campgrounds/new");
        } else {
            res.redirect("/campgrounds");
        }
        
    });
});

//SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

/*** Comment Routing ***/
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            throw err;
        } else {
            res.render("comments/new", {campground : foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            throw err;
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    throw err;
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});

/*** Authentication Routes ***/
//Register
app.get("/register", function(req, res) {
    res.render("authentication/register");
});

app.post("/register", function(req, res) {
    User.register(new User({username : req.body.username}), req.body.password, function(err, user) {
        if (err){
            console.log(err);
            return res.render("authentication/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
    });
});

//Login
app.get("/login", function(req, res) {
    res.render("authentication/login");
});

app.post("/login", 
    passport.authenticate("local", 
    {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }), 
    function(req, res) {
});


//Logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

/*** RUN SERVER ***/
app.listen(port, function() {
    console.log("Yelpcamp: Server Running on Port " + port);
});


/*** WORKER FUNCTIONS ***/
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

function createSanitizedInput(campgroundObject) {
    return {
        name : campgroundObject.name, 
        image : campgroundObject.image,
        description: sanitizer(campgroundObject.description)
    };
}