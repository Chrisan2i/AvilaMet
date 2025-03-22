const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: String,
  user: String,
  userId: String,
  date: String
});

const PostSchema = new mongoose.Schema({
  text: String,
  image: String,
  date: String,
  user: String,
  userPhoto: String,
  userId: String,
  comments: [CommentSchema],
  likes: Number,
  likedBy: [String]
});

module.exports = mongoose.model('Post', PostSchema);
