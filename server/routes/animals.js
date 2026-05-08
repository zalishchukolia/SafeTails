const express  = require('express')
const router   = express.Router()
const Animal   = require('../models/Animal')
const https    = require('https')
const cloudinary = require('cloudinary').v2
const multer   = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// ─── Cloudinary config ───────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'safetails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
  },
})

const upload = multer({ storage })

// ─── Admin secret middleware ─────────────────────────────
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

// POST — з фото (до 4 файлів: 1 головне + 3 галерея)
router.post(
  '/',
  requireSecret,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'gallery',   maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const { lat, lng } = await geocodeCity(req.body.city)

      const imageUrl = req.files?.mainImage?.[0]?.path || null
      const gallery  = (req.files?.gallery || []).map(f => f.path)

      const animal = new Animal({
        ...req.body,
        lat,
        lng,
        imageUrl,
        gallery,
      })

      await animal.save()
      res.status(201).json(animal)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
)

// PUT — оновлення з можливістю зміни фото
router.put(
  '/:id',
  requireSecret,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'gallery',   maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const update = { ...req.body }

      if (req.body.city) {
        const { lat, lng } = await geocodeCity(req.body.city)
        update.lat = lat
        update.lng = lng
      }

      if (req.files?.mainImage?.[0]) {
        update.imageUrl = req.files.mainImage[0].path
      }

      if (req.files?.gallery?.length) {
        update.gallery = req.files.gallery.map(f => f.path)
      }

      const animal = await Animal.findByIdAndUpdate(req.params.id, update, { new: true })
      if (!animal) return res.status(404).json({ message: 'Тварину не знайдено' })
      res.json(animal)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
)

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