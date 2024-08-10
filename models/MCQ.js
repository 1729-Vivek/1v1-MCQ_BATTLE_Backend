// {
//     "body": "What is the capital of France?",
//     "explanation": "The capital of France is Paris.",
//     "options": [
//       { "body": "Paris", "is_correct": true },
//       { "body": "London", "is_correct": false },
//       { "body": "Berlin", "is_correct": false },
//       { "body": "Madrid", "is_correct": false }
//     ]
//   }
const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  body: { type: String, required: true },
  is_correct: { type: Boolean, default: false },
});

const MCQSchema = new mongoose.Schema({
  body: { type: String, required: true },  // Adjusted from 'question' to 'body'
  explanation: { type: String, required: false }, // Added explanation field
  options: [OptionSchema], // Use the new OptionSchema for options
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('MCQ', MCQSchema);
