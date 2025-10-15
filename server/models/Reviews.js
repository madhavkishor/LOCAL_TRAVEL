import express from 'express';
import Review from '../models/Review.js';
import Destination from '../models/Destination.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a destination
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const reviews = await Review.find({ destination: req.params.destinationId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's reviews
router.get('/user', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('destination', 'name image')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a review
router.post('/', auth, async (req, res) => {
  try {
    const { destinationId, rating, comment } = req.body;

    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({
      user: req.user.id,
      destination: destinationId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this destination' });
    }

    // Create review
    const review = new Review({
      user: req.user.id,
      destination: destinationId,
      rating,
      comment
    });

    await review.save();

    // Populate user info for response
    await review.populate('user', 'name');

    // Update destination rating and review count
    const destinationReviews = await Review.find({ destination: destinationId });
    const averageRating = destinationReviews.reduce((sum, rev) => sum + rev.rating, 0) / destinationReviews.length;
    
    await Destination.findByIdAndUpdate(destinationId, {
      rating: Math.round(averageRating * 10) / 10,
      reviews: destinationReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a review
router.put('/:reviewId', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update destination rating
    const destinationReviews = await Review.find({ destination: review.destination });
    const averageRating = destinationReviews.reduce((sum, rev) => sum + rev.rating, 0) / destinationReviews.length;
    
    await Destination.findByIdAndUpdate(review.destination, {
      rating: Math.round(averageRating * 10) / 10
    });

    await review.populate('user', 'name');
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a review
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const destinationId = review.destination;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Update destination rating and review count
    const destinationReviews = await Review.find({ destination: destinationId });
    
    if (destinationReviews.length > 0) {
      const averageRating = destinationReviews.reduce((sum, rev) => sum + rev.rating, 0) / destinationReviews.length;
      await Destination.findByIdAndUpdate(destinationId, {
        rating: Math.round(averageRating * 10) / 10,
        reviews: destinationReviews.length
      });
    } else {
      await Destination.findByIdAndUpdate(destinationId, {
        rating: 0,
        reviews: 0
      });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const hasMarkedHelpful = review.helpful.includes(req.user.id);
    
    if (hasMarkedHelpful) {
      // Remove helpful mark
      review.helpful = review.helpful.filter(userId => userId.toString() !== req.user.id);
    } else {
      // Add helpful mark
      review.helpful.push(req.user.id);
    }

    await review.save();
    res.json({ helpful: review.helpful.length, hasMarkedHelpful: !hasMarkedHelpful });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;