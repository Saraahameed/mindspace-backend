const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    if (!userId || !movieId) {
      return res.status(400).json({ message: 'Please provide both userId and movieId.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.favourites?.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in favourites.' });
    }

    user.favourites.push(movieId);
    await user.save();

    res.status(201).json({ message: 'Movie added to favourites!', favourites: user.favourites });
  } catch (error) {
    res.status(500).json({ message: "Error saving favourite." });
  }
});

// Get all favourites for a user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favourites');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ favourites: user.favourites || [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favourites.' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    if (!userId || !movieId) {
      return res.status(400).json({ message: 'Please provide both userId and movieId.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.favourites = user.favourites.filter(fav => fav.toString() !== movieId);
    await user.save();

    res.status(200).json({ message: 'Movie removed from favourites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;