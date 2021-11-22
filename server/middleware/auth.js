const jwt = require('jsonwebtoken');
const { User } = require('../models/')

const verifyToken = async (token, tokenSecret) => {
  return jwt.verify(
    token,
    tokenSecret,
    async (error, payload) => {
      let user = null;
      if (error) {
        throw (error)
      } else {
        user = await User.findOne({
          where: {
            id: payload.id,
          },
          attributes: ['id', 'email', 'full_name', 'role']
        })
      }
      return user;
    }
  )
}

module.exports.verifyAccessToken = async (req, res, next) => {
  try {
    const user = await verifyToken(req.get('access-token'), process.env.ACCESS_TOKEN_SECRET);
    if (!user) throw new Error('Invalid access token')
    req.user = user;
    next();
  } catch (error) {
    res.status(401).
      json({
        error: error.message || 'Invalid access token'
      })
  }
}

module.exports.verifyRefreshToken = async (req, res, next) => {
  try {
    const user = await verifyToken(req.get('refresh-token'), process.env.REFRESH_TOKEN_SECRET);
    if (!user) throw new Error('Invalid access token')
    req.user = user;
    next();
  } catch (error) {
    res.status(401).
      json({
        error: error.message || 'Invalid refresh token'
      })
  }
}

module.exports.verifyFaculty = async (req, res, next) => {
  try {
    if (req.user.role !== 'faculty') {
      throw new Error('User is forbidden')
    }
    next();
  } catch (error) {
    res.status(403).
      json({
        error: error.message
      })
  }
}

module.exports.verifyStudent = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      throw new Error('User is forbidden')
    }
    next();
  } catch (error) {
    res.status(403).
      json({
        error: error.message
      })
  }
}