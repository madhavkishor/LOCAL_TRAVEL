import express from 'express';
import Destination from '../models/Destination.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const destinations = await Destination.find(filter);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seed sample data
router.post('/seed', async (req, res) => {
  try {
    const sampleDestinations = [
      {
        name: "Heritage Fort Museum",
        category: "historical",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
        rating: 4.7,
        reviews: 342,
        description: "Ancient fort with stunning architecture and rich history spanning 500 years.",
        location: "Old City Center",
        coordinates: { lat: 28.6139, lng: 77.2090 },
        price: "$$",
        bestTime: "Morning (9 AM - 12 PM)",
        weather: "Sunny, 24°C"
      },
      {
        name: "Mountain View Trail",
        category: "adventure",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        rating: 4.9,
        reviews: 567,
        description: "Breathtaking hiking trail with panoramic views and diverse wildlife.",
        location: "Northern Hills",
        coordinates: { lat: 28.7041, lng: 77.1025 },
        price: "$",
        bestTime: "Early Morning (6 AM - 10 AM)",
        weather: "Clear, 18°C"
      },
      {
        name: "Spice Garden Restaurant",
        category: "food",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        rating: 4.6,
        reviews: 892,
        description: "Authentic local cuisine with farm-to-table ingredients and rooftop seating.",
        location: "Downtown District",
        coordinates: { lat: 28.6289, lng: 77.2065 },
        price: "$$$",
        bestTime: "Evening (7 PM - 10 PM)",
        weather: "Pleasant, 22°C"
      },
      {
        name: "Serenity Lake Park",
        category: "relaxation",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        rating: 4.8,
        reviews: 423,
        description: "Peaceful lakeside park perfect for picnics, meditation, and sunset views.",
        location: "East Lake District",
        coordinates: { lat: 28.5355, lng: 77.3910 },
        price: "Free",
        bestTime: "Sunset (5 PM - 7 PM)",
        weather: "Cloudy, 20°C"
      },
      {
        name: "Artisan Market Square",
        category: "food",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        rating: 4.5,
        reviews: 678,
        description: "Vibrant marketplace featuring local crafts, street food, and live music.",
        location: "Central Plaza",
        coordinates: { lat: 28.6692, lng: 77.4538 },
        price: "$$",
        bestTime: "Afternoon (2 PM - 6 PM)",
        weather: "Sunny, 26°C"
      },
      {
        name: "Canyon Rock Climbing",
        category: "adventure",
        image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800",
        rating: 4.9,
        reviews: 234,
        description: "Thrilling rock climbing experience with professional guides and equipment.",
        location: "Western Canyon",
        coordinates: { lat: 28.4089, lng: 77.3178 },
        price: "$$$",
        bestTime: "Morning (8 AM - 12 PM)",
        weather: "Clear, 21°C"
      },
      {
        name: "Zen Garden Temple",
        category: "relaxation",
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
        rating: 4.8,
        reviews: 456,
        description: "Tranquil temple gardens with meditation sessions and traditional tea ceremonies.",
        location: "South Garden District",
        coordinates: { lat: 28.4595, lng: 77.0266 },
        price: "$",
        bestTime: "Early Morning (6 AM - 9 AM)",
        weather: "Misty, 19°C"
      },
      {
        name: "Royal Palace Complex",
        category: "historical",
        image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
        rating: 4.7,
        reviews: 789,
        description: "Magnificent palace showcasing royal heritage with guided tours and exhibits.",
        location: "Palace Road",
        coordinates: { lat: 28.6562, lng: 77.2410 },
        price: "$$",
        bestTime: "Afternoon (2 PM - 5 PM)",
        weather: "Sunny, 25°C"
      }
    ];

    await Destination.deleteMany({});
    await Destination.insertMany(sampleDestinations);
    
    res.json({ message: 'Sample data seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;