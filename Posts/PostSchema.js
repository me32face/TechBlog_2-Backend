const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    userDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    hashtags:{
        type:String
    },
    image:{
        type:String
    },
    datePosted:{
        type:Date,
        required:true
    },
    lastUpdated: {
        type: Date
    },
    updateCount: {
        type: Number,
        default: 0
    },
    isActive:{
        type:Boolean,
        default:false
    },

    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    reactions: [
        {
        viewerId: String,
        type: String,
        },
    ]
})

module.exports = new mongoose.model("posts", postSchema);