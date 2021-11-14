const {
  verifyAccessToken,
  verifyFaculty,
} = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { User, Classroom, Category, Channel, Request } = require('../models')
const { Op } = require('sequelize');

router.get('/', verifyAccessToken, async (req, res) => {
  try {
    let classroomsFind = Classroom.findAll({
      order: [['created_at', 'desc']]
    })
    let userClassroomsFind = User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['classrooms']
    }).then((data) => data.classrooms)
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
      attributes: ['classrooms', 'id']
    })
    let classroom = await Classroom.create({
      name,
      description,
      members,
      created_by: id
    })
    user.classrooms = [...user.classrooms, classroom.id];
    await user.save().then();
    res.status(200).json(classroom)
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
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })
    if (!classroom) throw new Error('id is invalid')
    let userObj = {}
    classroom.members.forEach((member) => userObj[member.id] = member)
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
    classroom.members = Object.values(userObj)
    res.status(200).json(classroom)
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
      classroom_id,
      request_id,
      new_user_id,
      role
    } = req.body;
    if (!classroom_id) throw new Error('classroom_id is required');
    if (!new_user_id) throw new Error('new_user_id is required');
    if (!role) role = 'student'
    let classroom = await Classroom.findOne({
      where: {
        id: classroom_id
      },
      attributes: ['members', 'id']
    })
    let permissionCheck = classroom.members.some((member) => {
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
        attributes: ['classrooms', 'id']
      })
      if (!user) throw new Error('User with this id does not exist');
      user.classrooms = [...user.classrooms, classroom.id];
      newMembers = []
      classroom.members.forEach((member) => {
        if (member.id === new_user_id) {
          throw new Error('User already exists in the classroom');
        }
        newMembers.push(member)
      })
      newMembers.push({
        id: new_user_id,
        role
      })
      classroom.members = newMembers
      await classroom.save().then(() => {
        user.save()
        Request.destroy({
          where: {id: request_id}
        })
      }
      );
      res.status(200).json(classroom)
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
    const { classroom_id, user_id } = req.body;
    if (!classroom_id) throw new Error('classroom_id is required');
    if (!user_id) throw new Error('user_id is required');
    let classroom = await Classroom.findOne({
      where: {
        id: classroom_id
      },
      attributes: ['members', 'id']
    })
    let permissionCheck = false;
    if (user_id === req.user.id) {
      permissionCheck = true;
    }
    else{
      permissionCheck = classroom.members.some((member) => {
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
        attributes: ['classrooms', 'id']
      })
      newMembers = classroom.members.filter((member) => member.id !== user_id)
      classroom.members = newMembers
      let user = await userFind
      user.classrooms = user.classrooms.filter((id) => id !== classroom.id)
      if (newMembers.length === 0) {
        await classroom.destroy().then(() => user.save());
        res.status(200).json('Removed user and classroom is deleted')
      }
      else {
        await classroom.save().then(() => user.save());
        res.status(200).json(classroom)
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