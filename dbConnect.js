const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;  // from .env

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('MongoDB connection successful');
});

module.exports = db;


// const mongoose=require("mongoose")
// mongoose.connect("mongodb://127.0.0.1/TechBlog")    
// var db=mongoose.connection
// db.on("error",console.error.bind("error"))
// db.once("open",function(){
//     console.log("connection successfull");
// })
// module.export=db;