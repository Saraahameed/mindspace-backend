const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get current user
router.get('/current-user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-hashedPassword');
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get user's favorites with populated movie data
router.get('/favorites', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favourites');
    res.json(user.favourites);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hashedPassword');
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Update user profile
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ err: 'You can only edit your own profile' });
    }

    const { username, email, phone, description } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phone, description },
      { new: true }
    ).select('-hashedPassword');

    res.json(updateUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;