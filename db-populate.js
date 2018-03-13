const mongoose = require("mongoose");


/* Schemas */
mongoose.connect("mongodb://localhost:27017/yelpcamp");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

function seedDB() {
    Campground.remove({}, function(err) {
        console.log("Cleared Campground DB");
        for (let camp in seedData) {
            Campground.create(
                seedData[camp], 
                function(err, campground) {
                    if (err) throw err;
                    Comment.create(
                        {
                            text : "Test Comment " + camp,
                            author: "Jimmy"
                        }, function(err, comment) {
                            if (err) throw err;
                            campground.comments.push(comment);
                            campground.save();
                            //console.log("Created Campground");
                    });
                }
            );
        }
    });


}

module.exports = seedDB;


const seedData = [
    {
        name : "Campground 1", 
        image : "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
        description: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum sit \
        amet elit et eleifend. Cras sed pretium odio. Curabitur id diam arcu. Quisque in scelerisque \
        elit, quis scelerisque risus. Duis euismod aliquet faucibus. Duis non ex lectus. Duis luctus \
        sed odio sed posuere. Curabitur finibus sem felis, ut maximus mi semper eget. Integer tempus eleifend \
        libero consequat mollis. Integer massa tellus, pretium ac suscipit eget, scelerisque et arcu. Sed posuere \
        ac justo eu porttitor.</p> <p>Aliquam et urna quis ante consectetur posuere. Aenean id commodo turpis. Morbi eu pulvinar \
        lectus. Praesent sit amet hendrerit elit. Suspendisse nec lectus rhoncus, dapibus neque quis, dictum lacus. Duis tincidunt\
         ut orci nec rutrum. Vestibulum rhoncus massa dolor, et molestie quam posuere facilisis. Lorem ipsum dolor sit amet,\
          consectetur adipiscing elit. Integer blandit magna sed lacinia bibendum. Interdum et malesuada fames ac ante ipsum primis\
           in faucibus.</p>"

    },
    {
        name : "Campground 2", 
        image : "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg",
        description: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum sit \
        amet elit et eleifend. Cras sed pretium odio. Curabitur id diam arcu. Quisque in scelerisque \
        elit, quis scelerisque risus. Duis euismod aliquet faucibus. Duis non ex lectus. Duis luctus \
        sed odio sed posuere. Curabitur finibus sem felis, ut maximus mi semper eget. Integer tempus eleifend \
        libero consequat mollis. Integer massa tellus, pretium ac suscipit eget, scelerisque et arcu. Sed posuere \
        ac justo eu porttitor.</p> <p>Aliquam et urna quis ante consectetur posuere. Aenean id commodo turpis. Morbi eu pulvinar \
        lectus. Praesent sit amet hendrerit elit. Suspendisse nec lectus rhoncus, dapibus neque quis, dictum lacus. Duis tincidunt\
         ut orci nec rutrum. Vestibulum rhoncus massa dolor, et molestie quam posuere facilisis. Lorem ipsum dolor sit amet,\
          consectetur adipiscing elit. Integer blandit magna sed lacinia bibendum. Interdum et malesuada fames ac ante ipsum primis\
           in faucibus.</p>"

    },
    {
        name : "Campground 3", 
        image : "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg",
        description: "<p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Phasellus dictum sit \
        amet elit et eleifend. Cras sed pretium odio. Curabitur id diam arcu. Quisque in scelerisque \
        elit, quis scelerisque risus. Duis euismod aliquet faucibus. Duis non ex lectus. Duis luctus \
        sed odio sed posuere. Curabitur finibus sem felis, ut maximus mi semper eget. Integer tempus eleifend \
        libero consequat mollis. Integer massa tellus, pretium ac suscipit eget, scelerisque et arcu. Sed posuere \
        ac justo eu porttitor.</p> <p>Aliquam et urna quis ante consectetur posuere. Aenean id commodo turpis. Morbi eu pulvinar \
        lectus. Praesent sit amet hendrerit elit. Suspendisse nec lectus rhoncus, dapibus neque quis, dictum lacus. Duis tincidunt\
         ut orci nec rutrum. Vestibulum rhoncus massa dolor, et molestie quam posuere facilisis. Lorem ipsum dolor sit amet,\
          consectetur adipiscing elit. Integer blandit magna sed lacinia bibendum. Interdum et malesuada fames ac ante ipsum primis\
           in faucibus.</p>"

    }

];

