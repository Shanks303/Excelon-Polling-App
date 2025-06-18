// routes/pollRoutes.js
const express = require('express');
const { createPoll, getPolls, getPoll, updatePoll, deletePoll, getResults } = require('../controllers/pollController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createPoll);
router.get('/', getPolls);
router.get('/:pollId', getPoll);
router.put('/:pollId', authMiddleware, updatePoll);
router.delete('/:pollId', authMiddleware, deletePoll);
router.get('/:pollId/results', authMiddleware, getResults);

module.exports = router;