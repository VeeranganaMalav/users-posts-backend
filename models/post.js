const mongoose = require('mongoose');
const User = require('./user');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;