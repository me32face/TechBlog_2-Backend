const mongoose = require("mongoose");

const likeDislikeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  browserId: {
    type: String,
    default: null,
  },
  action: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("likesdislikes", likeDislikeSchema);
