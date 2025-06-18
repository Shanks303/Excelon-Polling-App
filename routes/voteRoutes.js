const express = require('express');
const { votePoll } = require('../controllers/voteController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:pollId/vote', authMiddleware, votePoll);

module.exports = router;