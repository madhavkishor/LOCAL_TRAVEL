import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Test route for root URL
app.get('/', (req, res) => {
  res.json({ 
    message: 'Local Travel Backend API is running!',
    endpoints: {
      auth: '/api/auth',
      destinations: '/api/destinations', 
      users: '/api/users',
      reviews: '/api/reviews'
    },
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Handle both MONGO_URI and MONGODB_URI environment variables
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/local-travel';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}`);
});