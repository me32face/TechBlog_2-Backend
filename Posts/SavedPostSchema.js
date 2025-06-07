const mongoose = require('mongoose');

const SavedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

SavedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model('SavedPost', SavedPostSchema);
