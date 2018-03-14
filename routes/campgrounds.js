const express = require("express");
const router = express.Router();
const sanitizer     = require("sanitize-html");

const Campground = require("../models/campground");


/*** Campgrounds Routing ***/


//INDEX
router.get("/", function(req, res) {
    Campground.find({})
        .exec(function(err, dbCampgrounds) {
            if (err) throw err;
            res.render("campgrounds/index", {campgrounds : dbCampgrounds});
    });
});

//NEW
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE
router.post("/", isLoggedIn, function(req, res) {
    let newCampground = {
        name : req.body.campground.name, 
        image : req.body.campground.image,
        author : {
            id : req.user._id,
            username : req.user.username
        },
        description: sanitizer(req.body.campground.description)
    };
    
    Campground.create(newCampground, function(err, submission){
        if (err) {
            res.redirect("/campgrounds/new");
        } else {
            res.redirect("/campgrounds");
        }
        
    });
});

//SHOW
router.get("/:id", function(req, res) {
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

//EDIT
router.get("/:id/edit", checkOwnerCampground, function(req, res) {
    Campground.findById(req.params.id)
        .exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE
router.put("/:id", checkOwnerCampground, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground)
        .exec(function(err, foundCampground) {
            if (err) {
                throw err;
                res.redirect("/campgrounds/" + req.params.id + "/edit");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
});

router.delete("/:id", checkOwnerCampground, function(req, res) {
    Campground.findByIdAndRemove(req.params.id)
        .exec(function(err, foundCampground) {
            if (err) {
                throw err;
                res.redirect("/campgrounds/" + req.params.id + "/edit");
            } else {
                res.redirect("/campgrounds/");
            }
        });
});

/*** Worker Functions ***/
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

function checkOwnerCampground(req, res, next) {
    if(req.isAuthenticated()) {  
        Campground.findById(req.params.id)
            .exec(function(err, foundCampground) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
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