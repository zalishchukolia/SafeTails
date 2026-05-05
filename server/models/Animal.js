const mongoose = require('mongoose')

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number },
  description: { type: String },
  status: { type: String, default: 'needs rescue' },
  imageUrl: { type: String },
  temperament: { type: String, enum: ['спокійний', 'активний', 'грайливий', 'лагідний', 'незалежний'], default: 'спокійний' },
  city: { type: String },      // ← ДОДАЙ ЦЕ
  lat:  { type: Number },      // ← ДОДАЙ ЦЕ
  lng:  { type: Number },      // ← ДОДАЙ ЦЕ
}, { timestamps: true })

module.exports = mongoose.model('Animal', animalSchema)