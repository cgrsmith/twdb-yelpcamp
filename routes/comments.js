const express = require("express");
const router = express.Router({mergeParams : true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");


/*** Comment Routing ***/
//New form
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            throw err;
        } else {
            res.render("comments/new", {campground : foundCampground});
        }
    });
});

//Create
router.post("/", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            throw err;
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    throw err;
                } else {
                    //add user data and save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save the campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});

//Edit
router.get("/:comment_id/edit", checkOwnerComment, function(req, res) {
    Comment.findById(req.params.comment_id).exec(function(err, foundComment) {
        if (err) {
            throw err;
            res.redirect("back");
        } else{
            res.render("comments/edit", {comment : foundComment, campgroundID : req.params.id});
        }
    });
});

//Update
router.put("/:comment_id", checkOwnerComment, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
        .exec(function(err, foundComment) {
            if (err) {
                throw err;
                res.redirect("back");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
});

//Delete
router.delete("/:comment_id", checkOwnerComment, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id)
        .exec(function(err, foundComment) {
            if (err) {
                throw err;
                res.redirect("back");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");

    }
}

function checkOwnerComment(req, res, next) {
    if(req.isAuthenticated()) {  
        Comment.findById(req.params.comment_id)
            .exec(function(err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }       
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;