const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');

router.post('/', async (req, res) => {
  try {
    const adoption = new Adoption(req.body);
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