const mongoose = require("mongoose");


/* Schemas */
mongoose.connect("mongodb://localhost:27017/yelpcamp");
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
const Campground = mongoose.model("Campground", campgroundSchema);

// var tempData = [
//     {name : "Campground 1", image : "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
//     {name : "Campground 2", image : "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg"},
//     {name : "Campground 3", image : "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg"},
// ]


Campground.create(
    {
        name : "Campground 1", 
        image : "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
        description: "Desc for Campground 1."

    },
    function(err, campground) {
        if (err) throw err;
    }
)
Campground.create(
    {
        name : "Campground 2", 
        image : "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg",
        description: "Desc for Campground 2."

    },
    function(err, campground) {
        if (err) throw err;
    }
)
Campground.create(
    {
        name : "Campground 3", 
        image : "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg",
        description: "Desc for Campground 3."

    },
    function(err, campground) {
        if (err) throw err;
    }
)