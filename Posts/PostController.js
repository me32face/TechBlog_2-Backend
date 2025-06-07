const postSchema = require("./PostSchema");
const upload = require("../cloudinaryConfig");



const addNewPost=((req,res)=>{

    let newPost=new postSchema({
        userDetails:req.body.userId,
        title:req.body.title,
        content:req.body.content,
        category:req.body.category,
        hashtags:req.body.hashtags,
        image: req.file ? req.file.path || req.file.filename : null,
        datePosted: new Date(),
    })
    newPost.save()
    .then((result)=>{
        res.json({
            msg:"Post Uploaded",
            data:result,
            status:200
        })
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            msg:"Something went wrong",
            err:err,
            status:404
        })
    })

})

const ViewPostsByUser = ((req,res)=>{
    postSchema.find({userDetails:req.params.id, isActive: true })
    .populate("userDetails", "username name")
    .then((result)=>{
        res.json({
            msg:"successfully found",
            status:200,
            data:result
        })
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            err:err,
            status:404
        })
    })
})

const ViewAllPosts=((req,res)=>{
    postSchema.find({ isActive: true })
    .populate("userDetails", "username name")
    .then((result)=>{
        res.json({
            msg:"successfully found",
            status:200,
            data:result
        })
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            err:err,
            status:404
        })
    })
})

const GetPostById = (req, res) => {
  const { id } = req.params;

  postSchema
    .findById(id)
    .populate("userDetails", "username name")
    .then((result) => {
      if (result) {
        res.status(200).json({
          msg: "Post fetched successfully",
          status: 200,
          data: result,
        });
      } else {
        res.status(404).json({
          msg: "Post not found",
          status: 404,
        });
      }
    })
    .catch((err) => {
      console.error("Error fetching post:", err);
      res.status(500).json({
        msg: "Server error",
        status: 500,
        err: err,
      });
    });
};


const DeletePostById = (req, res) => {
  postSchema
    .findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          msg: "Post not found",
          status: 404,
        });
      }
      if(result){
        res.json({
          msg: "Deleted Successfully",
          status: 200,
          data: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Error deleting post",
        status: 500,
        err: err,
      });
    });
};

const updatePost = ((req, res) => {
  const postId = req.params.id;
  const { title, content, category, hashtags } = req.body;

  if (!title || !content || !category) {
    return res.json({
      msg: "Title, content, and category are required fields.",
      status: 400
    });
  }

  postSchema.findById(postId)
    .then((post) => {
      if (!post) {
        return res.json({
          msg: "Post not found",
          status: 404
        });
      }

      post.title = title;
      post.content = content;
      post.category = category;
      post.hashtags = hashtags || "";
      // post.datePosted = new Date();
      post.lastUpdated = new Date();
      post.updateCount = (post.updateCount || 0) + 1;
      reactions: [
        {
          viewerId: { type: String, required: true },
          type: { type: String, enum: ['like', 'dislike'], required: true },
        }
      ]


      return post.save();
    })
    .then((updatedPost) => {
      res.json({
        msg: "Post updated successfully",
        status: 200,
        data: updatedPost
      });
    })
    .catch((err) => {
      console.log("Error updating post:", err);
      res.json({
        msg: "Internal server error",
        err: err,
        status: 500
      });
    });
});


//Admin Manage posts from here

const managePosts = (req, res) => {
  postSchema.find()
    .populate("userDetails", "username name") 
    .then((posts) => {
      res.json({
        msg: "Successfully fetched posts",
        status: 200,
        data: posts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        msg: "Failed to fetch posts",
        status: 500,
        err: err,
      });
    });
};


const getPendingPosts = (req, res) => {
  postSchema.find({ isActive: false })
    .populate("userDetails", "username name")
    .then((posts) => {
      res.json({
        msg: "Fetched pending posts",
        status: 200,
        data: posts
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Error fetching pending posts",
        err: err,
        status: 500
      });
    });
};


const approvePost = (req, res) => {
  const postId = req.params.id;

  postSchema.findByIdAndUpdate(postId, { isActive: true }, { new: true })
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({
          msg: "Post not found",
          status: 404
        });
      }
      res.json({
        msg: "Post approved successfully",
        status: 200,
        data: updatedPost
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Error approving post",
        err: err,
        status: 500
      });
    });
};


const ViewPostsByCategory = (req, res) => {
  const categoryName = req.params.category;
  postSchema.find({ category: categoryName, isActive: true })
  .populate("userDetails", "username name")
  .then((result) => {
    res.json({
      msg: `Posts in category: ${categoryName}`,
      status: 200,
      data: result,
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      msg: "Error fetching category posts",
      err: err,
      status: 500,
    });
  });
};

const searchPosts = (req, res) => {
  const query = req.query.q || "";

  if (!query) {
    return res.status(400).json({
      msg: "Search query is required",
      status: 400,
    });
  }

  const regex = new RegExp(query, "i");

  postSchema.find({
    isActive: true,
    $or: [
      { title: regex },
      { category: regex },
      { hashtags: regex },
    ],
  })
    .populate("userDetails", "username name")
    .then((posts) => {
      res.json({
        msg: "Search results",
        status: 200,
        posts: posts,
      });
    })
    .catch((err) => {
      console.error("Search error:", err);
      res.status(500).json({
        msg: "Server error",
        status: 500,
        err: err,
      });
    });
};


module.exports={
  addNewPost,upload,
  ViewPostsByUser,ViewAllPosts,
  GetPostById,DeletePostById,updatePost,
  managePosts,getPendingPosts,
  approvePost,ViewPostsByCategory,
  searchPosts
}