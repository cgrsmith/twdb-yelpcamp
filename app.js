const express = require("express");
const app = express();
const parser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const sanitizer = require("sanitize-html");

const port = process.env.PORT || 3000;

app.use(parser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

/* SCHEMAS */
mongoose.connect("mongodb://localhost:27017/yelpcamp");
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
const Campground = mongoose.model("Campground", campgroundSchema);


/* ROUTING */
app.get("/", function(req, res) {
    res.redirect("/campgrounds");
});

//INDEX
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, dbCampgrounds) {
        if (err) throw err;
        res.render("index", {campgrounds : dbCampgrounds});
    });
});

//CREATE
app.post("/campgrounds", function(req, res) {
    Campground.create(createSanitizedInput(req.body),
    function(err, submission){
        if (err) {
            res.redirect("/campgrounds/new");
        } else {
            res.redirect("/campgrounds");
        }
        
    });
});

//NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

//SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});



app.listen(port, function() {
    console.log("Yelpcamp: Server Running on Port " + port);
});

/*** WORKER FUNCTIONS ***/

function createSanitizedInput(campgroundObject) {
    return {
        name : campgroundObject.name, 
        image : campgroundObject.image,
        description: sanitizer(campgroundObject.description)
    };
}