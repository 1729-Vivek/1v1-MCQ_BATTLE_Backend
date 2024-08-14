// models/Game.js
const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['waiting', 'active', 'completed'], default: 'waiting' },
  mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],
  scores: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, default: 0 }
  }],
  startTime: { type: Date },
  endTime: { type: Date }
});

module.exports = mongoose.model('Game', GameSchema);