const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const requireAuth = require('../middleware/auth');

router.post('/', requireAuth, async (req, res) => {
  try {
    const adoption = new Adoption({ ...req.body, userId: req.user.id });
    await adoption.save();
    res.status(201).json(adoption);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find().populate('animalId');
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;