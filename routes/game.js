const express = require('express');
const auth = require('../middleware/authMiddleware');
const Game = require('../models/Game');
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
      mcqs: [],
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

module.exports = router;
