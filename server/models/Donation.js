const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);