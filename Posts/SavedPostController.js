const SavedPost = require("./SavedPostSchema");


const savePost = (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ msg: "Missing userId or postId", status: 400 });
  }

  SavedPost.findOne({ userId, postId })
    .then((existing) => {
      if (existing) {
        return res.status(409).json({ msg: "Post already saved", status: 409 });
      }

      SavedPost.create({ userId, postId })
        .then((saved) => {
          res.status(200).json({ msg: "Post saved", status: 200, data: saved });
        })
        .catch((err) => {
          res.status(500).json({ msg: "Error saving post", status: 500, err });
        });
    })
    .catch((err) => {
      res.status(500).json({ msg: "Error checking saved post", status: 500, err });
    });
};


const getSavedPosts = (req, res) => {
  const { userId } = req.params;

  SavedPost.find({ userId })
    .populate("postId") 
    .then((posts) => {
      res.status(200).json({ msg: "Saved posts", status: 200, data: posts });
    })
    .catch((err) => {
      res.status(500).json({ msg: "Error fetching saved posts", status: 500, err });
    });
};


const removeSavedPost = (req, res) => {
  const { userId, postId } = req.params;

  SavedPost.findOneAndDelete({ userId, postId })
    .then((removed) => {
      if (!removed) {
        return res.status(404).json({ msg: "Not found", status: 404 });
      }
      res.status(200).json({ msg: "Removed", status: 200, data: removed });
    })
    .catch((err) => {
      res.status(500).json({ msg: "Error removing saved post", status: 500, err });
    });
};



module.exports = {
  savePost,
  getSavedPosts,
  removeSavedPost
};