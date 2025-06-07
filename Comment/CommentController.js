const Comment = require("../Comment/CommentSchema"); // adjust path as needed

// Add Comment
const addComment = (req, res) => {
  const { postId, userId, commentText } = req.body;

  if (!postId || !userId || !commentText) {
    return res.json({ msg: "All fields are required.", status: 400 });
  }

  const newComment = new Comment({
    postId,
    userId,
    commentText,
  });

  newComment
    .save()
    .then((result) => {
      return Comment.findById(result._id).populate("userId", "username name");
    })
    .then((populatedComment) => {
      res.json({
        msg: "Comment added successfully",
        status: 200,
        data: {
          _id: populatedComment._id,
          commentText: populatedComment.commentText,
          userId: populatedComment.userId._id,
          username: populatedComment.userId.username,
          createdAt: populatedComment.createdAt,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "Failed to add comment", status: 500, error: err });
    });
};

// Delete Comment
const deleteComment = (req, res) => {
  const commentId = req.params.id;

  if (!commentId) {
    return res.json({ msg: "Comment ID is required", status: 400 });
  }

  Comment.findByIdAndDelete(commentId)
    .then((deleted) => {
      if (!deleted) {
        return res.json({ msg: "Comment not found", status: 404 });
      }
      res.json({ msg: "Comment deleted successfully", status: 200 });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "Error deleting comment", status: 500, error: err });
    });
};

const getCommentsByPostId = (req, res) => {
  const postId = req.params.postId;

  Comment.find({ postId })
    .sort({ createdAt: -1 })
    .populate("userId", "username name")
    .then((comments) => {
      const formattedComments = comments.map((c) => ({
        _id: c._id,
        commentText: c.commentText,
        userId: c.userId._id,
        username: c.userId.username,
        createdAt: c.createdAt,
      }));

      res.json({
        msg: "Comments fetched successfully",
        status: 200,
        data: formattedComments,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "Error fetching comments", status: 500, error: err });
    });
};

module.exports = { addComment, deleteComment, getCommentsByPostId };
