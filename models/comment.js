const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    author: {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : String
        },
        username : String
    },
    date: {type: Date, default: Date.now()},
    text: String
});
module.exports = mongoose.model("Comment", commentSchema);