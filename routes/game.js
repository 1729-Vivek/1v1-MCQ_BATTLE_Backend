const express = require('express');
const auth = require('../middleware/authMiddleware');
const Game = require('../models/Game');
const MCQ = require('../models/MCQ');
const router = express.Router();

// Create a new game
router.post('/', auth, async (req, res) => {
  try {
    const newGame = new Game({
      owner: req.user.id,
      status: 'waiting',
    });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).send('Server error');
  }
});

// Join a game
router.post('/:gameId/join', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).send('Game not found');
    if (game.status !== 'waiting') return res.status(400).send('Game is not in waiting state');
    if (game.participants.includes(req.user.id)) return res.status(400).send('Already joined');

    game.participants.push(req.user.id);
    if (game.participants.length > 1) game.status = 'active';
    await game.save();

    res.json(game);
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).send('Server error');
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).send('Server error');
  }
});

// Get details of a specific game, including MCQs
// Add MCQs to a game
// Add MCQs to a game
router.post('/:gameId/add-mcqs', auth, async (req, res) => {
    try {
      const { mcqIds } = req.body; // Array of MCQ IDs
      if (!mcqIds || !Array.isArray(mcqIds)) return res.status(400).send('Invalid MCQ IDs');
  
      const game = await Game.findById(req.params.gameId);
      if (!game) return res.status(404).send('Game not found');
      if (game.owner.toString() !== req.user.id) return res.status(403).send('Not authorized');
  
      // Ensure MCQ IDs are valid
      const validMcqs = await MCQ.find({ '_id': { $in: mcqIds } });
      if (validMcqs.length !== mcqIds.length) return res.status(400).send('One or more MCQ IDs are invalid');
  
      // Add each MCQ ID to the game
      mcqIds.forEach(mcqId => {
        if (!game.mcqs.includes(mcqId)) {
          game.mcqs.push(mcqId);
        }
      });
  
      await game.save();
      console.log('MCQs added to game:', game.mcqs); // Debugging log
      res.json(game);
    } catch (error) {
      console.error('Error adding MCQs:', error);
      res.status(500).send('Server error');
    }
  });
  
  // Get details of a specific game, including MCQs
  router.get('/:gameId', async (req, res) => {
    try {
      const game = await Game.findById(req.params.gameId).populate('mcqs');
      console.log('Fetched game details:', game); // Debugging log
      if (!game) return res.status(404).send('Game not found');
      res.json(game);
    } catch (error) {
      console.error('Error fetching game details:', error);
      res.status(500).send('Server error');
    }
  });
  
  

// Submit an answer for a game
router.post('/:gameId/answer', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).send('Game not found');

    const mcq = await MCQ.findById(req.body.mcqId);
    if (!mcq) return res.status(404).send('MCQ not found');

    const isCorrect = mcq.options.some(option => option.body === req.body.answer && option.is_correct);

    // Logic to update scores here (if needed)

    res.json({ correct: isCorrect });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
