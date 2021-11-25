const {
  verifyAccessToken,
} = require('../middleware/auth');
const { verifyPermissionClassroom } = require('../middleware/classroom');
const express = require('express');
const router = express.Router();
const { Category, Channel } = require('../models');
const {
  NEW_CHANNEL,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL
} = require('../socketevents');

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
    channel = { ...channel.get() }
    channel.category = category
    io.in(classroom.id).emit(NEW_CHANNEL, channel)
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
    let classroom = req.classroom
    let channel = await Channel.findOne({
      where: {
        id
      }
    })
    if (!channel) throw new Error('channel not found.')
    let prev_category_id = channel.category_id;
    if (channel_name)
      channel.name = channel_name
    if (category_id)
      channel.category_id = category_id
    if (message_permission)
      channel.message_permission = message_permission
    await channel.save();
    channel = { ...channel.get(), prev_category_id }
    io.in(classroom.id).emit(UPDATE_CHANNEL, channel)
    res.status(200).json(channel);
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
    let classroom = req.classroom
    if (!channel_id) throw new Error('Channel ID is required');
    let channel = await Channel.findOne({
      where: {
        id: channel_id
      },
      attributes: ['id', 'name', 'category_id']
    })
    if (!channel) throw new Error('Channel not found')
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
    io.in(classroom.id).emit(REMOVE_CHANNEL, channel)
    res.sendStatus(204);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

module.exports = router;