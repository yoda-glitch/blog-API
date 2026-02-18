const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const user = await User.create({ first_name, last_name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      user: { id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({
      user: { id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
