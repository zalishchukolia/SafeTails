const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Adoption = require('../models/Adoption')

// Отримати всі заявки, якщо треба
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find().sort({ createdAt: -1 })
    res.json(adoptions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Створити заявку — тільки для авторизованого користувача
router.post('/', auth, async (req, res) => {
  try {
    const adoption = await Adoption.create({
      ...req.body,
      user: req.user.id,
    })

    res.status(201).json(adoption)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router