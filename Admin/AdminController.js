require('dotenv').config();

const userSchema = require("../User/UserRegistrationSchema");
const postSchema = require("../Posts/PostSchema");



// Admin login handler
const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};


const getDashboardCounts = (req, res) => {
  userSchema.find()
    .then((users) => {
      const totalUsers = users.length;
      return postSchema.find().then((posts) => {
        const totalPosts = posts.length;
        return postSchema.find({ isActive: false }).then((pendingPosts) => {
          res.json({
            msg: "Dashboard data fetched",
            status: 200,
            totalUsers,
            totalPosts,
            pendingPosts: pendingPosts.length,
          });
        });
      });
    })
    .catch((err) => {
      console.error("Error fetching dashboard data", err);
      res.status(500).json({
        msg: "Something went wrong",
        err: err,
        status: 500,
      });
    });
};


module.exports = { adminLogin,getDashboardCounts };
