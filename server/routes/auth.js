const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User, Session } = require('../models');
const {
  verifyRefreshToken,
} = require('../middleware/auth');

const generateAccessToken = (usr) => {
  return jwt.sign(usr, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.EXPIRE_TIME
  })
}

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
      const accessToken = generateAccessToken(userInfo);
      const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET)
      userInfo.email = usr.email;
      userInfo.teams = usr.teams;
      await Session.create({
        user_id: usr.id,
        refresh_token: refreshToken
      });
      res.header('access-token', accessToken)
      res.header('refresh-token', refreshToken)
      res.header('expires-in', process.env.EXPIRE_TIME)
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
    const refresh_token = req.get('refresh-token');
    if (refresh_token) {
      const usr = req.user;
      let session = await Session.findOne({
        where: {
          user_id: usr.id,
          refresh_token
        }
      });
      if (session) {
        let userInfo = {
          id: usr.id,
          full_name: usr.full_name,
          role: usr.role
        }
        const accessToken = generateAccessToken(userInfo);
        res.header('access-token', accessToken)
        res.header('expires-in', process.env.EXPIRE_TIME)
        res.sendStatus(204);
      } else {
        throw new Error('Forbidden: refresh-token is expired')
      }
    } else {
      throw new Error('Forbidden: refresh-token is required')
    }
  } catch (error) {
    res.status(403).json({
      error: error.message
    });
  }
})

router.delete('/signout', async (req, res) => {
  try {
    const refresh_token = req.get('refresh-token');
    if (refresh_token) {
      await Session.destroy({
        where: {
          refresh_token
        }
      });
      res.sendStatus(204);
    } else {
      throw new Error('Forbidden: refresh-token is required')
    }
  } catch (err) {
    res.status(403).json({
      error: err.message
    })
  }
})

module.exports = router;