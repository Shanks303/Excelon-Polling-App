const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, passwordHash });
        res.status(201).json(user);
    } catch {
        res.status(400).send('User already exists.');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(400).send('Invalid credentials.');
    }
    const token = generateToken(user._id, user.email);
    res.json({ token });
};
