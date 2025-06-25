const express = require("express");
const Router = express.Router();
const upload = require("./cloudinaryConfig");

const userController = require("./User/UserRegistrationController");
const postController = require("./Posts/PostController");
const adminController = require("./Admin/AdminController");
const commentController = require("./Comment/CommentController");
const reactionController = require("./Posts/LikeDislikeController");
const savedPostController = require("./Posts/SavedPostController");
const aiController = require("./Posts/AIController");





// Route for managing posts (viewing all posts for admin)
Router.post("/ManagePosts", postController.managePosts);       // Changed to GET to fetch posts for management
Router.post("/AdminLogin", adminController.adminLogin); 
Router.get("/admin/pending-posts", postController.getPendingPosts);
Router.put("/admin/approve-posts/:id", postController.approvePost);
Router.get("/admin-dashboard", adminController.getDashboardCounts);
Router.delete("/DeleteUser/:id", userController.DeleteUserUsingId);



// User Routes
Router.post("/userRegistration", userController.upload.single("image"), userController.adduser);
Router.post("/ViewUserData", userController.viewUserData);
Router.post("/userLogin", userController.userLogin);
Router.post("/ViewUsers", userController.ViewUsers);
Router.post("/ForgotPassword", userController.ForgotPassword);
Router.post("/UserProfile/:id", userController.UserProfile);
Router.put("/UpdateUserProfile/:id", userController.UpdateUserProfile);




// Post Routes
Router.post("/AddPost", upload.single("image"), postController.addNewPost);
Router.post("/UsersPosts/:id", postController.ViewPostsByUser);
Router.get("/category/:category", postController.ViewPostsByCategory);
Router.get("/search", postController.searchPosts);  



// Saved Posts Routes
Router.post("/saved/save-post", savedPostController.savePost); // Save a post
Router.get("/saved/:userId", savedPostController.getSavedPosts); // Get saved posts for a user
Router.delete("/saved/:userId/:postId", savedPostController.removeSavedPost); // Remove a saved post



// Routes to view, update, delete posts
Router.get("/AllPosts", postController.ViewAllPosts);          // Changed to GET for fetching all posts
Router.post("/GetPostById/:id", postController.GetPostById);    // Changed to GET for fetching a specific post
Router.delete("/DeletePost/:id", postController.DeletePostById); // Delete post by ID
Router.put("/UpdatePost/:id", postController.updatePost);    // Update post by ID




//Comment Routers
Router.post("/comment/add-comment", commentController.addComment);
Router.get("/comment/get-comments/:postId", commentController.getCommentsByPostId);
Router.delete("/comment/delete/:id", commentController.deleteComment);


//Likes
Router.post("/like-dislike", reactionController.likeOrDislikePost);
Router.get("/like-dislike/get-count/:postId", reactionController.getLikesDislikes);



// Ping route for cold start check
Router.get('/ping', (req, res) => {
  res.status(200).send('Backend awake');
});


Router.post("/related-posts", aiController.getRelatedPosts);



module.exports = Router;