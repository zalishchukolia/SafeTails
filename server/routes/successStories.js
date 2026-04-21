console.log("successStories router loaded");
const express = require('express')
const router = express.Router()
const SuccessStory = require('../models/SuccessStory')

router.get('/', async (req, res) => {
  try {
    const stories = await SuccessStory.find()
    res.json(stories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const story = new SuccessStory(req.body)
    await story.save()
    res.status(201).json(story)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
