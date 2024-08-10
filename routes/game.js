const express = require('express');
const auth = require('../middleware/authMiddleware');
const Game = require('../models/Game');
const MCQ = require('../models/MCQ'); // Assuming you have an MCQ model
const Pusher = require('pusher');

// Initialize Pusher
const pusher = new Pusher({
  appId: "1834030",
  key: "d29bf340b0ce1bfc0bc9",
  secret: "e3d076b9d32b0e4a2c0f",
  cluster: "ap2",
  useTLS: true,
});

const router = express.Router();

// Create game
router.post('/', auth, async (req, res) => {
  try {
    const game = new Game({
      owner: req.user.id,
      mcqs: [], // Add MCQs if needed
    });

    await game.save();

    // Trigger a Pusher event after the game is created
    pusher.trigger('lobby', 'game-created', {
      gameId: game._id,
      owner: game.owner,
      status: game.status
    });

    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// List games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({ status: 'waiting' });
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Join game
router.post('/:gameId/join', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).send('Game not found');

    if (game.participants.includes(req.user.id)) {
      return res.status(400).send('You are already in this game');
    }

    game.participants.push(req.user.id);

    if (game.participants.length >= 2) {
      game.status = 'active';
    }

    await game.save();

    // Trigger a Pusher event when a user joins the game
    pusher.trigger('lobby', 'game-updated', {
      gameId: game._id,
      status: game.status
    });

    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get game details
router.get('/:gameId', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId).populate('mcqs');
    if (!game) return res.status(404).send('Game not found');
    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Submit answer
router.post('/:gameId/answer', auth, async (req, res) => {
  try {
    const { mcqId, answer } = req.body;
    const game = await Game.findById(req.params.gameId).populate('mcqs');

    if (!game) return res.status(404).send('Game not found');

    const mcq = game.mcqs.find(mcq => mcq._id.toString() === mcqId);
    if (!mcq) return res.status(404).send('MCQ not found');

    const correct = mcq.correctOption === answer;

    if (correct) {
      // Update the user's score
      const scoreEntry = game.scores.find(score => score.user.toString() === req.user.id);
      if (scoreEntry) {
        scoreEntry.score += 1;
      } else {
        game.scores.push({ user: req.user.id, score: 1 });
      }
    }

    await game.save();

    res.json({ correct });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
