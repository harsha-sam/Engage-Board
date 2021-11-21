const {
  verifyAccessToken,
} = require('../middleware/auth');
const { verifyPermissionClassroom } = require('../middleware/classroom');
const express = require('express');
const router = express.Router();
const { Category, Channel } = require('../models');

router.post('/', verifyAccessToken, verifyPermissionClassroom, async (req, res) => {
  try {
    const {
      channel_name,
      category_id,
      category_name,
      message_permission
    } = req.body;
    if (!channel_name || !message_permission) {
      throw new Error("Channel Name and Message Permission are required")
    }
    if (!category_id && !category_name) {
      throw new Error("Category is required")
    }
    let classroom = req.classroom
    // creating a new category
    let category = null;
    if (!category_id && category_name) {
      category = await Category.create({
        name: category_name,
        classroom_id: classroom.id,
      })
    }
    else {
      // finding existing category
      category = await Category.findOne({
        where: {
          id: category_id
        }
      })
    }
    let channel = await Channel.create({
      name: channel_name,
      classroom_id: classroom.id,
      category_id: category.id,
      message_permission
    })
    res.json(channel);
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.patch('/:id', verifyAccessToken, verifyPermissionClassroom, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      throw new Error('Channel ID is required')
    const {
      channel_name,
      category_id,
      message_permission
    } = req.body;
    let update_obj = {}
    if (channel_name)
      update_obj.name = channel_name
    if (category_id)
      update_obj.category_id = category_id
    if (message_permission)
      update_obj.message_permission = message_permission
    let channels = await Channel.update(update_obj, {
      where: {
        id
      },
      returning: true
    })
    if (channels[0] === 0) throw new Error('channel not found.')
    res.status(200).json(channels[1][0]);
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.delete('/', verifyAccessToken, verifyPermissionClassroom, async (req, res) => {
  try {
    const { channel_id } = req.query;
    if (!channel_id) throw new Error('Channel ID is required');
    let channel = await Channel.findOne({
      where: {
        id: channel_id
      },
      attributes: ['id', 'category_id']
    })
    let { count } = await Channel.findAndCountAll({
      where: {
        category_id: channel.category_id
      },
      attributes: ['id']
    })
    if (count === 1) {
      await Category.destroy({
        where: {
          id: channel.category_id
        }
      })
    }
    else {
      await channel.destroy();
    }
    res.sendStatus(204);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

module.exports = router;