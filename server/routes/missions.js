const express = require('express')
const router = express.Router()
const Mission = require('../models/Missions')  

// GET всі місії — публічний
router.get('/', async (req, res) => {
  try {
    const missions = await Mission.find().sort({ createdAt: -1 })
    res.json(missions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST нова місія — публічний (або додай requireSecret якщо треба)
router.post('/', async (req, res) => {
  try {
    const mission = new Mission(req.body)
    await mission.save()
    res.status(201).json(mission)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE місія — 
router.delete('/:id', async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id)
    if (!mission) return res.status(404).json({ message: 'Місію не знайдено' })
    res.json({ message: 'Місію видалено' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router