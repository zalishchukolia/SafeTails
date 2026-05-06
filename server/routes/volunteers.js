const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Volunteer = require('../models/Volunteer')

router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 })
    res.json(volunteers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const volunteer = await Volunteer.create({
      ...req.body,
      user: req.user.id,
    })

    res.status(201).json(volunteer)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router