const express = require('express')
const router  = express.Router()
const Animal  = require('../models/Animal')
const https   = require('https')

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
  return new Promise((resolve) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&countrycodes=UA&accept-language=uk`
    https.get(url, { headers: { 'User-Agent': 'SafeTails/1.0' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json && json[0]) {
            resolve({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) })
          } else {
            resolve({ lat: null, lng: null })
          }
        } catch {
          resolve({ lat: null, lng: null })
        }
      })
    }).on('error', () => resolve({ lat: null, lng: null }))
  })
}

// ─── ROUTES ─────────────────────────────────────────────

// GET всі тварини — публічний (без архівованих)
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find({ archived: { $ne: true } })
    res.json(animals)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET архівовані тварини — публічний
// ⚠️ Цей роут ПЕРЕД /:id щоб Express не сприйняв 'archived' як ID
router.get('/archived', async (req, res) => {
  try {
    const animals = await Animal.find({ archived: true })
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

// PATCH — архівування тварини
router.patch('/:id/archive', requireSecret, async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(
      req.params.id,
      { archived: true, status: 'archived' },
      { new: true }
    )
    if (!animal) return res.status(404).json({ message: 'Тварину не знайдено' })
    res.json(animal)
  } catch (err) {
    res.status(500).json({ message: err.message })
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