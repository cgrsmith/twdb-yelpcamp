const express = require("express");
const router = express.Router({mergeParams : true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const midWare = require("../middleware/index");

/*** Comment Routing ***/
//New form
router.get("/new", midWare.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            throw err;
        } else {
            res.render("comments/new", {campground : foundCampground});
        }
    });
});

//Create
router.post("/", midWare.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            throw err;
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    throw err;
                } else {
                    //add user data and save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save the campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment Added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});

//Edit
router.get("/:comment_id/edit", midWare.checkOwnerComment, function(req, res) {
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
router.put("/:comment_id", midWare.checkOwnerComment, function(req, res) {
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
router.delete("/:comment_id", midWare.checkOwnerComment, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id)
        .exec(function(err, foundComment) {
            if (err) {
                throw err;
                res.redirect("back");
            } else {
                req.flash("success", "Comment Deleted");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
});


module.exports = router;