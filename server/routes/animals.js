const express = require('express')
const router = express.Router()
const Animal = require('../models/Animal')

router.get('/', async (req, res) => {
  const animals = await Animal.find()
  res.json(animals)
})

router.get('/:id', async (req, res) => {
  const animal = await Animal.findById(req.params.id)
  if (!animal) return res.status(404).json({ message: 'Not found' })
  res.json(animal)
})

router.post('/', async (req, res) => {
  const animal = new Animal(req.body)
  await animal.save()
  res.status(201).json(animal)
})

module.exports = router