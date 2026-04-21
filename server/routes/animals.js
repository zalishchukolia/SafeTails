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

// GET одна тварина
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Тварину не знайдено' });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT оновити тварину
router.put('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!animal) return res.status(404).json({ message: 'Тварину не знайдено' });
    res.json(animal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE видалити тварину
router.delete('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Тварину не знайдено' });
    res.json({ message: 'Тварину видалено' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router