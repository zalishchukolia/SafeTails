const express = require('express')
const router  = express.Router()
const Animal  = require('../models/Animal')

const requireSecret = (req, res, next) => {
  const secret = req.headers['x-admin-secret']
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}

// ─── Геокодинг по місту ──────────────────────────────────
async function geocodeCity(city) {
  if (!city) return { lat: null, lng: null }
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&countrycodes=UA&accept-language=uk`
    const res  = await fetch(url, {
      headers: { 'User-Agent': 'SafeTails/1.0 (safetails@gmail.com)' }
    })
    const data = await res.json()
    if (data && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch (err) {
    console.error('Geocode error:', err.message)
  }
  return { lat: null, lng: null }
}

// ─── ROUTES ─────────────────────────────────────────────

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

// POST — захищений + геокодинг
router.post('/', requireSecret, async (req, res) => {
  try {
    const { lat, lng } = await geocodeCity(req.body.city)
    const animal = new Animal({ ...req.body, lat, lng })
    await animal.save()
    res.status(201).json(animal)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT — захищений + геокодинг якщо змінилось місто
router.put('/:id', requireSecret, async (req, res) => {
  try {
    const update = { ...req.body }
    if (req.body.city) {
      const { lat, lng } = await geocodeCity(req.body.city)
      update.lat = lat
      update.lng = lng
    }
    const animal = await Animal.findByIdAndUpdate(req.params.id, update, { new: true })
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