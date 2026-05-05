const express = require('express')
const router = express.Router()
const Animal = require('../models/Animal')

// Middleware захисту для змін
const requireSecret = (req, res, next) => {
  const secret = req.headers['x-admin-secret']
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}

// ─── ANIMALS ────────────────────────────────────────────

// GET всі тварини — публічний
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find()
    res.json(animals)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET одна тварина за ID — публічний
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
    if (!animal) return res.status(404).json({ message: 'Тварину не знайдено' })
    res.json(animal)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST — захищений
router.post('/', requireSecret, async (req, res) => {
  try {
    const animal = new Animal(req.body)
    await animal.save()
    res.status(201).json(animal)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT — захищений
router.put('/:id', requireSecret, async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!animal) return res.status(404).json({ message: 'Тварину не знайдено' })
    res.json(animal)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE — захищений
router.delete('/:id', requireSecret, async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id)
    if (!animal) return res.status(404).json({ message: 'Тварину не знайдено' })
    res.json({ message: 'Тварину видалено' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router