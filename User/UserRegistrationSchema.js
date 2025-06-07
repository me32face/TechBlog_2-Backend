const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    username: { 
        type: String,
        required: true
    },

    email: { 
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    confirmPassword: {
        type: String
    },

    image: {
        type: Object
    },

    bio: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    dob: {
        type: Date,
        default: null
    },

    socialLinks: {
        type: String,
        default: ""
    }
});

module.exports = new mongoose.model("users", userschema);