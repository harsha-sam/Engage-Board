const { Classroom } = require('../models/')

module.exports.verifyPermissionClassroom = async (req, res, next) => {
  try {
    let {
      classroom_id,
    } = req.body;
    if (!classroom_id)
      classroom_id = req.query.classroom_id
    if (!classroom_id) throw new Error('classroom_id is required');
    const classroom = await Classroom.findOne({
      where: {
        id: classroom_id
      },
    })
    if (!classroom) {
      throw new Error('Classroom not found')
    }
    let member = classroom.members[req.user.id]
    if (!(member?.role === 'admin' || member?.role === 'monitor'))
      res.status(403).
        json({
          error: "Action prohibited due to lack of permission. Admin and Monitor has full access"
        })
    req.classroom = classroom;
    next();
  } catch (error) {
    res.status(400).
      json({
        error: error.message || 'Something went wrong'
      })
  }
}

module.exports.verifyLeaveClassroom = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    if (req.user.id !== user_id) {
      return this.verifyPermissionClassroom(req, res, next);
    }
    else {
      let {
        classroom_id,
      } = req.body;
      if (!classroom_id) throw new Error('classroom_id is required');
      const classroom = await Classroom.findOne({
        where: {
          id: classroom_id
        },
      })
      if (!classroom) {
        throw new Error('Classroom not found')
      }
      req.classroom = classroom;
      return next();
    }
  }
  catch (error) {
    res.status(400).
      json({
        error: error.message || 'Something went wrong'
      })
  }
}