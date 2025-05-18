const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user (customer or agency)
exports.registerUser = async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User(req.body);
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const payload = { userId: user._id, userType };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token,
      userId: user._id 
     });
  } catch (err) {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    res.status(500).send('Server error');

  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id, userType: user.userType };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token,
      userId: user._id 
     });
  } catch (err) {
    res.status(500).send('Server error');
  }
};