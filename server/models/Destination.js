import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['adventure', 'historical', 'food', 'relaxation']
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  price: {
    type: String,
    required: true,
    enum: ['Free', '$', '$$', '$$$']
  },
  bestTime: {
    type: String,
    required: true
  },
  weather: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Destination', destinationSchema);