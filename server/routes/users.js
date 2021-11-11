const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/auth');
const { User } = require('../models');

router.get('/me', verifyAccessToken, async (req, res) => res.json(req.user))

router.patch('/me', verifyAccessToken, async (req, res) => {
  try {
    const {
      avatar
    } = req.body;
    let updateObj = {}
    if (avatar) updateObj.avatar = avatar;
    if (!updateObj) {
      throw new Error('Please send fields which are to be updated')
    }
    let user = await User.update(updateObj, {
      where: {
        id: req.user.id
      }
    })
    res.status(200).json(user);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})
module.exports = router;