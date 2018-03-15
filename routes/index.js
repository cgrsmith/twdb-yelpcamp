const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const passport = require("passport");

const User = require("../models/user");

/*** Landing Page Route ***/
router.get("/", function(req, res) {
    res.render("partials/landing");
});

/*** Authentication Routes ***/

//Register
router.get("/register", function(req, res) {
    res.render("authentication/register");
});

router.post("/register", function(req, res) {
    User.register(new User({username : req.body.username}), req.body.password, function(err, user) {
        if (err){
            req.flash("error", err.message);
            return res.render("authentication/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Successfully Registered - Welcome " + user.username);
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
    req.flash("success", "Logged Out");
    req.logout();
    res.redirect("/campgrounds");
});


module.exports = router;