const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  animalName: { type: String, required: true },
  ownerName: { type: String, required: true },
  story: { type: String, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);