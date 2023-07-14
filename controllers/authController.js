const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const TokenBlacklist = require('../models/tokenBlacklist');

require('dotenv').config();
const saltRounds = 10;

const jwtSecret = process.env.JWT_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION;
const refreshSecret = process.env.REFRESH_SECRET;

module.exports.register = async (req, res) => {
  try{
      const { username, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.create({ 
          username: username,
          email: email,
          password: hashedPassword,
          role: role
      });

      console.log(user);
  
      res.status(201).send({ message: 'User registered successfully', user: user });
    }
    catch(err){
      res.status(500).send({ error: 'Failed to register user' });
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try{
      const user = await User.findOne({ email });
  
      if(!user){
        res.status(401).send({ error: 'Invalid email' });
        return;
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if(!passwordMatch){
        res.status(401).send({ error: 'Invalid password' });
        return;
      }
  
      // Generate access token
      let accessToken = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: tokenExpiration });

      // Generate refresh token
      const refreshToken = jwt.sign({ userId: user._id }, refreshSecret);

      // Store refresh token securely (e.g., set as an HTTP-only cookie)
      // res.cookie('refreshToken', refreshToken, { httpOnly: true });
      
      res.status(200).json({ accessToken });
    }
    catch(err){
      res.status(500).send({ error: 'Failed to login the user' });
    }
};

module.exports.getUsers = async (req, res) => {
    try {
      const users = await User.find();

      res.status(200).send(users);
    }
    catch (err) {
      res.status(500).send({ error: 'Failed to retrieve the users' });
    }
};

module.exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;

      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

      res.status(200).send({ message: 'User updated successfully', user: updatedUser });
    }
    catch (err) {
      res.status(500).send({ error: 'Failed to update the user' });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;

      const deletedUser = await User.findByIdAndDelete(id);

      res.status(200).send({ message: 'User deleted successfully', user: deletedUser });
    }
    catch (err) {
      res.status(500).send({ error: 'Failed to delete the user' });
    }
};

module.exports.populatePosts = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('posts');

    res.status(200).send(user);
  }
  catch (err) {
    res.status(500).send({ error: 'Failed to populate the posts' });
  }
};

module.exports.logout = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  try{

    const isTokenBlackListed = await TokenBlacklist.findOne({ token: refreshToken });

    if(isTokenBlackListed){
      res.status(400).send({ message: 'User has been already logged out' });
      return;
    }

    const tokenBlacklist = new TokenBlacklist({ token: refreshToken });
    await tokenBlacklist.save();

    // Clear refresh token from client-side (e.g., remove cookie)
    // res.clearCookie('refreshToken');

    res.status(200).send({ message: 'User logged out successfully' });
  }
  catch(err){
    res.status(500).send({ error: 'Failed to logout the user' });
  }
};