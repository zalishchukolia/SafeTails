const mongoose = require('mongoose')

const animalSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  species:     { type: String, required: true },
  gender:      { type: String, enum: ['male', 'female'], default: 'male' },
  age:         { type: Number },
  description: { type: String },
  status: {
    type: String,
    enum: ['needs rescue', 'in rescue', 'in recovery', 'rescued'],
    default: 'needs rescue'
  },
  imageUrl:    { type: String },
  temperament: { type: String, enum: ['спокійний', 'активний', 'грайливий', 'лагідний', 'незалежний'], default: 'спокійний' },
  city:        { type: String },
  lat:         { type: Number },
  lng:         { type: Number },
}, { timestamps: true })

module.exports = mongoose.model('Animal', animalSchema)