require("dotenv").config();
const {
  verifyAccessToken,
} = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Request, Team, User } = require('../models')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const { team_id } = req.body;
    if (!team_id) throw new Error('team_id is required');
    let request = await Request.findOne({
      where: {
        team_id,
        user_id: req.user.id
      }
    })
    if (request) {
      throw new Error('Already there is a request pending');
    }
    else {
      let team = await Team.findOne({
        where: { id: team_id },
        attributes: ['created_by', 'id', 'name'],
        include: [
          {
            model: User,
            as: 'admin',
            attributes: ['email', 'full_name']
          }
        ]
      })
      let to = team.admin.email;
      let requests_url = "http://localhost:3000/manage-teams"
      let html = `<p>Hey, ${team.admin.full_name}. ${req.user.full_name}(${req.user.id} - ${req.user.role}) has just requested to join your classroom ${team.name}</p>Please navigate <a href=${requests_url}>here</a> to accept the request.`
      const message = {
        to,
        from: {
          name:'Engage Board',
          email: process.env.SENDER_MAIL,
        },
        subject: 'Request to join',
        text: `Hey, ${team.admin.full_name}. ${req.user.full_name}(${req.user.id} - ${req.user.role}) has just requested to join your classroom ${team.name}. Please navigate to ${requests_url} to accept the request`,
        html,
      }
      sgMail.send(message)
        .then((response) => console.log('Email Sent'))
        .catch(err => console.log(error.message))
      request = await Request.create({
        team_id,
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
    const { team_id } = req.query;
    if (!team_id) throw new Error('team_id is required');
    let request = await Request.findOne({
      where: {
        team_id,
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