// require('dotenv').config();

// const express = require('express');
// const app = express();
// const bodyparser = require('body-parser');
// const db = require('./dbConnect');
// const router = require('./Router');
// const cors=require("cors")

// app.use(cors({
//   origin: ["http://localhost:3000", "https://techblog-online.vercel.app"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// app.use(bodyparser.json());
// app.use(express.static(`${__dirname}/upload`));

// app.use(router);
// const port = process.env.PORT || 3003;
// app.listen(port,function(){
//     console.log(`Running on ${port}`);
// });


require('dotenv').config();

const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const db = require('./dbConnect');
const router = require('./Router');
const cors=require("cors")
app.use(bodyparser.json());
app.use(cors())
app.use(express.static(`${__dirname}/upload`));

app.use("/Techblog",router);
const port = 3003;
app.listen(port,function(){
    console.log(`Running on ${port}`);
});