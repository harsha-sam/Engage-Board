require("dotenv").config();
const {
  verifyAccessToken,
} = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Request, Classroom, User } = require('../models')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


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
      let to = classroom.admin.email;
      let requests_url = process.env.REQUESTS_URL
      let html = `<Please>Hey, ${classroom.admin.full_name}. ${req.user.full_name}(${req.user.id} - ${req.user.role}) has just requested to join your classroom ${classroom.name}. Please navigate <a href=${requests_url}>here</a> to accept the request.</p>`
      const message = {
        to,
        from: {
          name:'Engage Board',
          email: process.env.SENDER_MAIL,
        },
        subject: 'Request to join',
        text: `Hey, ${classroom.admin.full_name}. ${req.user.full_name}(${req.user.id} - ${req.user.role}) has just requested to join your classroom ${classroom.name}. Please navigate to ${requests_url} to accept the request`,
        html,
      }
      sgMail.send(message)
        .then((response) => console.log('Email Sent'))
        .catch(err => console.log(error.message))
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
      throw new Error('Admin has already processed your request, please refresh');
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