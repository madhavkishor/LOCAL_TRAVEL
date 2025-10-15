import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites')
      .populate('tripPlanner');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to favorites
router.post('/favorites/:destinationId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const destinationId = req.params.destinationId;

    if (!user.favorites.includes(destinationId)) {
      user.favorites.push(destinationId);
      await user.save();
    }

    await user.populate('favorites');
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from favorites
router.delete('/favorites/:destinationId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.destinationId);
    await user.save();

    await user.populate('favorites');
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to trip planner
router.post('/trip-planner/:destinationId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const destinationId = req.params.destinationId;

    if (!user.tripPlanner.includes(destinationId)) {
      user.tripPlanner.push(destinationId);
      await user.save();
    }

    await user.populate('tripPlanner');
    res.json({ tripPlanner: user.tripPlanner });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from trip planner
router.delete('/trip-planner/:destinationId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.tripPlanner = user.tripPlanner.filter(trip => trip.toString() !== req.params.destinationId);
    await user.save();

    await user.populate('tripPlanner');
    res.json({ tripPlanner: user.tripPlanner });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;