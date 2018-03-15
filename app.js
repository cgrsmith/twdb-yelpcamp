/*** Dependancies ***/
const express       = require("express");
const app           = express();
const parser        = require("body-parser");
const path          = require("path");
const mongoose      = require("mongoose");
const passport      = require("passport");
const LocalStrategy = require("passport-local");
const override      = require("method-override");
const flash         = require("connect-flash");
/*** Routes ***/
const campgroundRoutes  = require("./routes/campgrounds");
const commentRoutes    = require("./routes/comments");
const indexRoutes       = require("./routes/index");

/*** Environment Variables ***/
const port = process.env.PORT || 3000;

/*** Config ***/
app.use(parser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(override("_method"));
app.use(flash());
app.set("view engine", "ejs");


/*** Models ***/
mongoose.connect("mongodb://localhost:27017/yelpcamp");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
//const seedDB = require("./db-populate"); //RE-SEED DB
//seedDB();

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
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*** Route Config ***/
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

/*** RUN SERVER ***/
app.listen(port, process.env.IP, function() {
    console.log("Yelpcamp: Server Running on Port " + port);
});




