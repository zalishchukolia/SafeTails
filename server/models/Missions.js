const mongoose = require('mongoose')

const missionSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  species:      { type: String, default: 'пес' },
  status:       { type: String, default: 'Watch' },
  priority:     { type: Number, default: 2 },
  distance:     { type: String },
  heartRate:    { type: String },
  location:     { type: String },
  assignedTeam: { type: String },
  summary:      { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Mission', missionSchema)