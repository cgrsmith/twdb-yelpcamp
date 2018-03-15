

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const flash = require("connect-flash");

let midwareObj = {};

midwareObj.checkOwnerCampground = function(req, res, next) {
    if(req.isAuthenticated()) {  
        Campground.findById(req.params.id)
            .exec(function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have that permission");
                    res.redirect("back");
                }       
            }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
}

midwareObj.checkOwnerComment = function(req, res, next) {
    if(req.isAuthenticated()) {  
        Comment.findById(req.params.comment_id)
            .exec(function(err, foundComment) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have that permission");
                    res.redirect("back");
                }       
            }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
}

midwareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("/login");
    }
}

module.exports = midwareObj;