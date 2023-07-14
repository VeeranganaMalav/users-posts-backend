const mongoose = require('mongoose');
const Post = require('./post');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
// match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/