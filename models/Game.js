const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['waiting', 'active', 'completed'], default: 'waiting' },
  mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],
  scores: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number }],
});

module.exports = mongoose.model('Game', GameSchema);
