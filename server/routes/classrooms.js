const {
  verifyAccessToken,
  verifyFaculty,
} = require('../middleware/auth');
const { verifyPermissionClassroom, verifyLeaveClassroom } = require('../middleware/classroom');
const express = require('express');
const router = express.Router();
const { User, Classroom, Category, Channel, Request } = require('../models')
const { Op } = require('sequelize');
const {
  DELETE_CLASSROOM,
  CONTENT_MODERATION_UPDATE,
  NEW_MEMBER,
  REMOVE_MEMBER,
} = require('../socketevents');

router.get('/', verifyAccessToken, async (req, res) => {
  try {
    let classroomsFind = Classroom.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['created_at', 'desc']]
    })
    // classrooms which the user is a part of
    let userClassroomsFind = User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['classrooms']
    }).then((data) => data.classrooms)
    // classroom requests of user
    let requestsFind = Request.findAll({
      where: {
        user_id: req.user.id,
      },
      attributes: ['classroom_id']
    }).then((data) => data.map((ele) => ele.classroom_id))
    res.json({
      classrooms: await classroomsFind,
      userClassrooms: await userClassroomsFind,
      classroomRequests: await requestsFind,
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
    // only faculty can create a classroom
    const {
      name,
      description
    } = req.body;
    if (!name || !description)
      throw new Error('name & description are required')
    let id = req.user.id;
    // by default, the faculty who created the classroom will be admin
    let members = {
      [id]: {
        id,
        role: 'admin',
      }
    }
    let user = await User.findOne({
      where: {
        id
      },
      attributes: ['classrooms', 'id']
    })
    let classroom = await Classroom.create({
      name,
      description,
      members,
      created_by: id
    })
    // we are not sending members list
    delete classroom.dataValues.members
    // adding this new classroom to user classrooms list
    user.classrooms = [...user.classrooms, classroom.id];
    await user.save();
    res.status(200).json(classroom)
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.get('/:id', verifyAccessToken, async (req, res) => {
  try {
    // returns all categories and channels of a specific classroom
    const { id } = req.params;
    if (!id) throw new Error('id is required');
    let classroom = await Classroom.findOne({
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
              attributes: ['id', 'name', 'message_permission']
            }
          ]
        }
      ]
    })
    if (!classroom) throw new Error('Classroom not found')
    let userObj = { ...classroom.members }
    let totalMembers = 0;
    if (!(req.user.id in userObj)) {
      res.status(403).json({
        error: `Forbidden: User is not part of the classroom ${classroom.name}`
      });
    }
    else {
      let users = await User.findAll({
        where: {
          id: {
            [Op.in]: Object.keys(userObj)
          }
        },
        attributes: ['full_name', 'id', 'email']
      })
      users.forEach((user) => {
        userObj[user.id] = { ...user.get(), ...userObj[user.id] }
        totalMembers += 1
      })
      classroom.members = userObj
      classroom.dataValues.total_members = totalMembers
      res.status(200).json(classroom)
    }
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.patch('/', verifyAccessToken, verifyPermissionClassroom, async (req, res) => {
  try {
    const {
      is_moderation_enabled
    } = req.body;
    if (is_moderation_enabled === null) {
      throw new Error('is_moderation_enabled is required');
    }
    let classroom = req.classroom;
    classroom.is_moderation_enabled = is_moderation_enabled
    await classroom.save();
    io.in(classroom.id).emit(CONTENT_MODERATION_UPDATE, {
      is_moderation_enabled
    })
    res.status(200).json({
      is_moderation_enabled: classroom.is_moderation_enabled
    });
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.post('/users', verifyAccessToken, verifyPermissionClassroom, async (req, res) => {
  try {
    // adding new users to a classroom
    let {
      request_id,
      new_user_id,
      role
    } = req.body;
    if (!new_user_id) throw new Error('new_user_id is required');
    if (!role) role = 'student'
    let request = null;
    if (request_id) {
      // request id related should be deleted
      request = await Request.findOne({
        where: { id: request_id }
      })
      if (!request) {
        throw new Error('Request not found. Either the user should have withdrawn request or the request should have been already processed.');
      }
    }
    let classroom = req.classroom
    let user = await User.findOne({
      where: {
        id: new_user_id
      },
      attributes: ['classrooms', 'id', 'full_name', 'role']
    })
    if (!user) throw new Error('User with this id does not exist');
    // adding this classroom to users classrooms list
    user.classrooms = [...user.classrooms, classroom.id];
    newMembers = { ...classroom.members }
    if (new_user_id in newMembers) {
      await Request.destroy({
        where: {
          user_id: new_user_id,
          classroom_id: classroom.id
        }
      })
      throw new Error('User already exists in the classroom');
    }
    newMembers[new_user_id] = {
      id: new_user_id,
      role
    }
    classroom.members = newMembers
    classroom.total_members = Object.keys(newMembers).length
    await classroom.save().then(() => {
      user.save()
      if (request_id) {
        // request id related should be deleted
        Request.destroy({
          where: { id: request_id }
        })
      }
      user = { ...user.get(), role }
      delete user.classrooms
      io.in(classroom.id).emit(NEW_MEMBER, user)
    });
    res.status(200).json(classroom)
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

router.patch('/users', verifyAccessToken, verifyLeaveClassroom, async (req, res) => {
  try {
    // removing users from a classroom
    const { user_id } = req.body;
    if (!user_id) throw new Error('user_id is required');
    let classroom = req.classroom
    let userFind = User.findOne({
      where: {
        id: user_id
      },
      attributes: ['classrooms', 'id']
    })
    // removing the user
    newMembers = { ...classroom.members }
    delete newMembers[user_id]
    classroom.members = newMembers
    classroom.total_members = Object.keys(newMembers).length
    let user = await userFind
    // removing this classroom from user classrooms list
    user.classrooms = user.classrooms.filter((id) => id !== classroom.id)
    if (newMembers.length === 0 || user_id === classroom.created_by) {
      // deleting if classroom has 0 members or if admin is leaving
      await classroom.destroy().then(() => user.save());
      user = { ...user.get() }
      delete user.classrooms
      io.in(classroom.id).emit(DELETE_CLASSROOM)
      res.status(200).json('Removed user and classroom is deleted')
    }
    else {
      await classroom.save().then(() => user.save());
      user = { ...user.get() }
      delete user.classrooms
      io.in(classroom.id).emit(REMOVE_MEMBER, user)
      res.status(200).json(classroom)
    }
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
})

module.exports = router;