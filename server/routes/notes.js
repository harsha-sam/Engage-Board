const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/auth');
const { Note } = require('../models');

router.get('/', verifyAccessToken, async (req, res) => {
  try {
    let notes = await Note.findAll({
      where: {
        created_by: req.user.id
      },
      attributes: ['id', 'name', 'created_at', 'updated_at'],
      order: [['updated_at', 'desc']]
    })
    res.status(200).json(notes);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error('Name is required')
    let note = await Note.create({
      name,
      created_by: req.user.id
    })
    res.status(200).json(note);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

router.get('/:id', verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error('id is required');
    let note = await Note.findOne({
      where: {
        id
      }
    })
    if (!note) {
      throw new Error('note not found.')
    }
    res.status(200).json(note);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

router.patch('/:id', verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error('id is required');
    const { name, data } = req.body;
    if (!name && !data) {
      throw new Error('name or data is required');
    }
    let update_obj = {}
    if (name) update_obj['name'] = name;
    if (data) update_obj['data'] = data;
    let notes = await Note.update(update_obj, {
      where: {
        id,
        created_by: req.user.id
      },
      returning: true
    })
    if (notes[0] === 0) throw new Error('note not found.')
    res.status(200).json(notes[1][0]);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

router.delete('/:id', verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error('id is required');
    await Note.destroy({
      where: {
        id,
        created_by: req.user.id
      }
    })
    res.sendStatus(204);
  }
  catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
})

module.exports = router;