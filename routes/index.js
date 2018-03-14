const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

router.get("/", function(req, res) {
    res.redirect("/campgrounds");
});

/*** Authentication Routes ***/

//Register
router.get("/register", function(req, res) {
    res.render("authentication/register");
});

router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
    res.render("authentication/login");
});

router.post("/login", 
    passport.authenticate("local", 
    {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }), 
    function(req, res) {
});


//Logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});



/*** WORKER FUNCTIONS ***/
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;