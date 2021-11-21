const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/auth');
const { User } = require('../models');

router.get('/', verifyAccessToken, async (req, res) => {
  // sending all users
  try {
    let users = await User.findAll({
      attributes: ['id', 'full_name', 'role', 'email', 'avatar'],
      order: [['full_name', 'asc']]
    })
    res.status(200).json(users);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

router.get('/me', verifyAccessToken, async (req, res) => res.json(req.user))

router.patch('/me', verifyAccessToken, async (req, res) => {
  try {
    // updating current user info
    const {
      avatar,
      full_name
    } = req.body;
    let updateObj = {}
    if (avatar) updateObj.avatar = avatar;
    if (full_name) updateObj.full_name = full_name
    if (!updateObj) {
      throw new Error('Please send fields which are to be updated')
    }
    let users = await User.update(updateObj, {
      where: {
        id: req.user.id
      }
    })
    if (users[0] === 0) throw new Error('user not found.')
    res.status(200).json(users[1][0]);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})
module.exports = router;