const Vote = require('../models/Vote');
const Poll = require('../models/Poll');

exports.votePoll = async (req, res) => {
    const { optionId } = req.body;
    const { pollId } = req.params;
    try {
        await Vote.create({ pollId, userId: req.user._id, optionId });
        await Poll.updateOne(
            { _id: pollId, 'options.optionId': optionId },
            { $inc: { 'options.$.votes': 1 } }
        );
        res.send('Vote recorded.');
    } catch {
        res.status(400).send('Already voted or invalid.');
    }
};