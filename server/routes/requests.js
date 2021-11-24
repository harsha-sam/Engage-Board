require("dotenv").config();
const {
  verifyAccessToken,
} = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { verifyPermissionClassroom } = require('../middleware/classroom');
const { Request, Classroom, User } = require('../models')
const { sendEmail } = require('../utils/sendEmail')

router.get('/', verifyAccessToken, verifyPermissionClassroom, async (req, res) => {
  try {
    let classroom = req.classroom
    let requests = await Request.findAll({
      where: {
        classroom_id: classroom.id
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'role']
        }
      ]
    })
    res.status(200).json(requests)
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const { classroom_id } = req.body;
    if (!classroom_id) throw new Error('classroom_id is required');
    let request = await Request.findOne({
      where: {
        classroom_id,
        user_id: req.user.id
      }
    })
    if (request) {
      throw new Error('Already there is a request pending');
    }
    else {
      let classroom = await Classroom.findOne({
        where: { id: classroom_id },
        attributes: ['created_by', 'id', 'name'],
        include: [
          {
            model: User,
            as: 'admin',
            attributes: ['email', 'full_name']
          }
        ]
      })
      if (!classroom) {
        throw new Error('Classroom does not exist. The admin of this classroom must have deleted it');
      }
      let to = classroom.admin.email;
      let requests_url = process.env.REQUESTS_URL
      let html = `<p>Hey, ${classroom.admin.full_name}. ${req.user.full_name}(${req.user.id} - ${req.user.role}) has just requested to join your classroom ${classroom.name}. Please navigate <a href=${requests_url}/${classroom_id}>here</a> and open manage classroom menu to accept the request.</p>`
      const message = {
        to,
        from: {
          name: 'Engage Board',
          email: process.env.SENDER_MAIL,
        },
        subject: 'Request to join',
        text: `Hey, ${classroom.admin.full_name}. ${req.user.full_name}(${req.user.id} - ${req.user.role}) has just requested to join your classroom ${classroom.name}. Please navigate to ${requests_url}/${classroom_id} and open manage classroom menu to accept the request`,
        html,
      }
      sendEmail(message)
      request = await Request.create({
        classroom_id,
        user_id: req.user.id
      })
      res.status(200).json(request)
    }
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.delete('/', verifyAccessToken, async (req, res) => {
  try {
    const { classroom_id } = req.query;
    if (!classroom_id) throw new Error('classroom_id is required');
    let request = await Request.findOne({
      where: {
        classroom_id,
        user_id: req.user.id
      }
    })
    if (!request) {
      throw new Error('Request has already been processed, please refresh');
    }
    await request.destroy();
    res.sendStatus(204);
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

module.exports = router;