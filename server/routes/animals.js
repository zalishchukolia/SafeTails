const express = require('express')
const router = express.Router()
const Animal = require('../models/Animal')

router.get('/', async (req, res) => {
  const animals = await Animal.find()
  res.json(animals)
})

router.post('/', async (req, res) => {
  const animal = new Animal(req.body)
  await animal.save()
  res.status(201).json(animal)
})

module.exports = router