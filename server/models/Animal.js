const mongoose = require('mongoose')

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number },
  description: { type: String },
  status: { type: String, default: 'needs rescue' },
  imageUrl: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Animal', animalSchema)