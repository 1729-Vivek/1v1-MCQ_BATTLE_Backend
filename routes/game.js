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
    const { mcqIds } = req.body;
    const game = await Game.findById(req.params.gameId);

    // Filter out MCQs that are already present
    const newMcqIds = mcqIds.filter((id) => !game.mcqs.includes(id));

    if (newMcqIds.length > 0) {
      game.mcqs.push(...newMcqIds);
      await game.save();
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding MCQs' });
  }
});

  // Get details of a specific game, including MCQs
  router.get('/:gameId', async (req, res) => {
    try {
      const game = await Game.findById(req.params.gameId).populate('mcqs');
      console.log("HELLO MCQS")
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
    if (isCorrect) {
      const userScore = game.scores.find(score => score.userId.toString() === req.user.id);
      if (userScore) {
        userScore.score += 1;
      } else {
        game.scores.push({ userId: req.user.id, score: 1 });
      }
      await game.save();
    }

    res.json({ correct: isCorrect });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).send('Server error');
  }
});
router.post('/:gameId/start',auth,async(req,res)=>{
  try{
    const game=await Game.findById(req.params.gameId);
    if(!game) return res.status(404).send('Game not found');

    game.status='active';
    game.startTime=new Date();
    await game.save();
    res.json(game);

  }
  catch(error){
    console.error('Error starting game:',error);
    res.status(500).send('Server Error')
  }
})
// Backend: End Game Route
router.post('/:gameId/end', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId)
      .populate('scores.userId', 'username'); // Populate the user details

    if (!game) return res.status(404).send('Game not found');

    game.status = 'completed';
    game.endTime = new Date();
    await game.save();

    const results = game.scores.map(score => ({
      user: score.userId.username,
      score: score.score
    }));

    // Compare scores
    let winner, loser;
    if (results[0].score > results[1].score) {
      winner = results[0];
      loser = results[1];
    } else if (results[1].score > results[0].score) {
      winner = results[1];
      loser = results[0];
    } else {
      winner = null; // It's a tie
      loser = null;
    }

    const scoreDifference = Math.abs(results[0].score - results[1].score);

    res.json({
      results,
      winner,
      loser,
      scoreDifference
    });
  } catch (error) {
    console.error('Error ending game:', error);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
