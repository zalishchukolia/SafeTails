const mongoose = require('mongoose')

const volunteerSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  city:         { type: String },
  contact:      { type: String, required: true },
  helpType:     { type: String },
  availability: { type: String },
  experience:   { type: String },
  note:         { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Volunteer', volunteerSchema)