const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  animalName: { type: String },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Adoption', adoptionSchema);