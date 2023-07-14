const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist');

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

module.exports.isAuthenticated = async (req, res, next) => {

  const refreshToken = req.headers.authorization?.split(' ')[1];

  if(!refreshToken){
    res.status(401).send({ error: 'Missing refresh token' });
    return;
  }

  try{
    const isBlacklisted = await TokenBlacklist.exists({ token: refreshToken });

    if (isBlacklisted) {
      res.status(401).send({ error: 'Authentication failed' });
      return;
    }

    jwt.verify(refreshToken, jwtSecret, (err, user) => {
      if(err){
        res.status(401).send({ error: 'Invalid refresh token' });
        return;
      }

      req.user = user;
      next();
    });
  }
  catch(err){
    res.status(500).send({ error: 'Failed to authenticate refresh token' });
  }
}