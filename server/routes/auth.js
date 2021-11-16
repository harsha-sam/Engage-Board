const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const {
  verifyRefreshToken,
} = require('../middleware/auth');

router.post('/signup', async (req, res) => {
  try {
    const {
      id,
      full_name,
      email,
      password,
      role
    } = req.body;
    await User.create({
      id,
      full_name,
      email,
      password,
      role
    })
      .then((data) => {
        res.json(data)
      })
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

router.post('/signin', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const usr = await User.findOne({
      where: {
        email
      }
    });
    if (!usr) {
      throw new Error('User does not exist.')
    }
    if (usr.validPassword(password)) {
      let userInfo = {
        id: usr.id,
        full_name: usr.full_name,
        role: usr.role
      }
      const accessToken = jwt.sign(userInfo,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      )
      const refreshToken = jwt.sign(userInfo,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
      )
      userInfo.email = usr.email;
      res.header('access-token', accessToken)
      res.header('refresh-token', refreshToken)
      res.json(userInfo);
    } else {
      throw new Error("Wrong Password. Please enter correct password to log in.");
    }
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

router.get('/token', verifyRefreshToken, async (req, res) => {
  try {
    // refreshing access toekn
    const refresh_token = req.get('refresh-token');
    if (refresh_token) {
      const usr = req.user;
      let userInfo = {
        id: usr.id,
        full_name: usr.full_name,
        role: usr.role
      }
      const accessToken = jwt.sign(userInfo,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      )
      res.header('access-token', accessToken)
      res.sendStatus(204);
    } else {
      throw new Error('Forbidden: refresh-token is required')
    }
  } catch (error) {
    res.status(403).json({
      error: error.message
    });
  }
})

module.exports = router;