const express = require('express')
const router = express.Router()
const Volunteer = require('../models/Volunteer')

router.post('/', async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body)
    await volunteer.save()
    res.status(201).json({ message: 'Заявку прийнято!' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router