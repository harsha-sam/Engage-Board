const {
  verifyAccessToken,
  verifyFaculty,
} = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { User, Team, Category, Channel, Request } = require('../models/')
const { Op } = require('sequelize');

router.get('/', verifyAccessToken, async (req, res) => {
  try {
    let teamsFind = Team.findAll({
      order: [['created_at', 'desc']]
    })
    let userTeamsFind = User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['teams']
    }).then((data) => data.teams)
    let requestsFind = Request.findAll({
      where: {
        user_id: req.user.id,
      },
      attributes: ['team_id']
    }).then((data) => data.map((ele) => ele.team_id))
    res.json({
      teams: await teamsFind,
      userTeams: await userTeamsFind,
      teamRequests: await requestsFind,
    })
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.post('/', verifyAccessToken, verifyFaculty, async (req, res) => {
  try {
    const {
      name,
      description
    } = req.body;
    if (!name || !description)
      throw new Error('name & description are required')
    let id = req.user.id;
    let members = [{
      id,
      role: 'admin'
    }]
    let user = await User.findOne({
      where: {
        id
      },
      attributes: ['teams', 'id']
    })
    let team = await Team.create({
      name,
      description,
      members,
      created_by: id
    })
    user.teams = [...user.teams, team.id];
    await user.save().then();
    res.status(200).json(team)
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.get('/:id', verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error('id is required');
    let team = await Team.findOne({
      where: {
        id
      },
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name'],
          include: [
            {
              model: Channel,
              as: 'channels',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })
    if (!team) throw new Error('id is invalid')
    let userObj = {}
    team.members.forEach((member) => userObj[member.id] = member)
    let users = await User.findAll({
      where: {
        id: {
          [Op.in]: Object.keys(userObj)
        }
      },
      attributes: ['full_name', 'id', 'avatar']
    })
    users.forEach((user) => {
      userObj[user.id] = { ...user.get(), ...userObj[user.id] }
    })
    team.members = Object.values(userObj)
    res.status(200).json(team)
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.post('/users', verifyAccessToken, async (req, res) => {
  try {
    let {
      team_id,
      request_id,
      new_user_id,
      role
    } = req.body;
    if (!team_id) throw new Error('team_id is required');
    if (!new_user_id) throw new Error('new_user_id is required');
    if (!role) role = 'student'
    let team = await Team.findOne({
      where: {
        id: team_id
      },
      attributes: ['members', 'id']
    })
    let permissionCheck = team.members.some((member) => {
      return ((member.id === req.user.id)
        && (member.role === 'admin' || member.role === 'monitor'))
    });
    if (!permissionCheck) {
      res.status(403).
        json({
          error: "Action prohibited due to lack of permission"
        })
    }
    else {
      let user = await User.findOne({
        where: {
          id: new_user_id
        },
        attributes: ['teams', 'id']
      })
      if (!user) throw new Error('User with this id does not exist');
      user.teams = [...user.teams, team.id];
      newMembers = []
      team.members.forEach((member) => {
        if (member.id === new_user_id) {
          throw new Error('User already exists in the team');
        }
        newMembers.push(member)
      })
      newMembers.push({
        id: new_user_id,
        role
      })
      team.members = newMembers
      await team.save().then(() => {
        user.save()
        Request.destroy({
          where: {id: request_id}
        })
      }
      );
      res.status(200).json(team)
    }
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.patch('/users', verifyAccessToken, async (req, res) => {
  try {
    const { team_id, user_id } = req.body;
    if (!team_id) throw new Error('team_id is required');
    if (!user_id) throw new Error('user_id is required');
    let team = await Team.findOne({
      where: {
        id: team_id
      },
      attributes: ['members', 'id']
    })
    let permissionCheck = false;
    if (user_id === req.user.id) {
      permissionCheck = true;
    }
    else{
      permissionCheck = team.members.some((member) => {
        return ((member.id === req.user.id)
          && (member.role === 'admin' || member.role === 'monitor'))
      });
    }
    if (!permissionCheck) {
      res.status(403).
        json({
          error: "Action prohibited due to lack of permission"
        })
    }
    else {
      let userFind = User.findOne({
        where: {
          id: user_id
        },
        attributes: ['teams', 'id']
      })
      newMembers = team.members.filter((member) => member.id !== user_id)
      team.members = newMembers
      let user = await userFind
      user.teams = user.teams.filter((id) => id !== team.id)
      if (newMembers.length === 0) {
        await team.destroy().then(() => user.save());
        res.status(200).json('Removed user and team is deleted')
      }
      else {
        await team.save().then(() => user.save());
        res.status(200).json(team)
      }
    }
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

module.exports = router;