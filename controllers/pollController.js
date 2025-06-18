const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
    const { question, options, startDate, endDate } = req.body;
    const pollOptions = options.map((text, i) => ({ optionId: `${i}`, text }));
    const poll = await Poll.create({ question, options: pollOptions, startDate, endDate, createdBy: req.user._id });
    res.status(201).json(poll);
};

exports.getPolls = async (req, res) => {
    const status = req.query.status;
    const now = new Date();
    let polls;
    if (status === 'active') polls = await Poll.find({ startDate: { $lte: now }, endDate: { $gte: now } });
    else if (status === 'closed') polls = await Poll.find({ endDate: { $lt: now } });
    else polls = await Poll.find();
    res.json(polls);
};

exports.getPoll = async (req, res) => {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).send('Poll not found.');
    res.json(poll);
};

exports.updatePoll = async (req, res) => {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll || poll.createdBy.toString() !== req.user._id) return res.status(403).send('Unauthorized or not found.');
    if (new Date() > poll.endDate) return res.status(400).send('Poll ended.');
    const { question, options, startDate, endDate } = req.body;
    poll.question = question || poll.question;
    poll.options = options || poll.options;
    poll.startDate = startDate || poll.startDate;
    poll.endDate = endDate || poll.endDate;
    await poll.save();
    res.json(poll);
};

exports.deletePoll = async (req, res) => {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll || poll.createdBy.toString() !== req.user._id) return res.status(403).send('Unauthorized or not found.');
    if (new Date() > poll.endDate) return res.status(400).send('Poll ended.');
    await Poll.deleteOne({ _id: poll._id });
    res.send('Poll deleted.');
};

exports.getResults = async (req, res) => {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).send('Poll not found.');
    const now = new Date();
    if (poll.endDate > now && !req.user) return res.status(403).send('Results unavailable.');
    res.json(poll.options);
};
