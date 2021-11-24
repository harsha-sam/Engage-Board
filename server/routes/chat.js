const {
  verifyAccessToken,
} = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { User, Message, Channel, Reaction, Classroom } = require('../models');
const { Op } = require('sequelize');
const { formatMessagesResponse } = require('../utils/messages');

router.get('/channels/:id', verifyAccessToken, async (req, res) => {
  try {
    // gets chat of a channel
    const { id } = req.params
    let where = {}
    if (id) where.channel_id = id
    else throw new Error('channel_id is required')
    let channel = await Channel.findOne({
      where: { id },
      include: [
        {
          model: Classroom,
          as: 'classroom',
          attributes: ['members', 'id']
        }
      ]
    })
    if (!channel) throw new Error('channel not found')
    if (!(req.user.id in channel.classroom.members)) {
      res.status(403).json({
        error: 'Forbidden: User is not part of the classroom'
      })
    }
    else {
      let messages = await Message.findAll({
        where,
        include: [
          {
            model: Reaction,
            as: 'reactions',
            attributes: ['id',
              'reaction',
              'created_at',
              'updated_at'
            ],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['full_name', 'id', 'role', 'email']
              }
            ],
          },
          {
            model: User,
            as: 'sender',
            attributes: ['full_name', 'id', 'role', 'email']
          }
        ],
        order: [['created_at', 'asc']]
      })
      res.status(200).json(formatMessagesResponse(messages))
    }
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.get('/', verifyAccessToken, async (req, res) => {
  try {
    // gets direct messages between user and receiver
    const {
      receiver_id,
    } = req.query;
    if (!receiver_id) {
      throw new Error('receiver_id is required')
    }
    let user = await User.findOne({
      where: {
        id: receiver_id
      },
      attributes: ['id', 'full_name', 'role', 'email']
    })
    if (!user) {
      throw new Error('user not found')
    }
    let messages = await Message.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ sender_id: req.user.id, },
            { receiver_id }]
          },
          {
            [Op.and]: [{ sender_id: receiver_id, },
            { receiver_id: req.user.id }]
          }
        ]
      },
      include: [
        {
          model: Reaction,
          as: 'reactions',
          attributes: ['id',
            'reaction',
            'created_at',
            'updated_at'
          ],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['full_name', 'id', 'role', 'email']
            }
          ],
        },
        {
          model: User,
          as: 'sender',
          attributes: ['full_name', 'id', 'role', 'email']
        }
      ],
      order: [['created_at', 'asc']]
    })
    res.status(200).json({
      messages: formatMessagesResponse(messages),
      receiver: user
    })
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }

})

module.exports = router;