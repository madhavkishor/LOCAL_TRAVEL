// src/services/api.js
// API service for all endpoints

// ✅ Backend base URL
const API_URL = 'http://localhost:5000/api'; // Change port if your backend runs on a different one

// ====================== DESTINATIONS API ======================
export const destinationsAPI = {
  // Get all destinations from backend with optional filters
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_URL}/destinations?${params}`);
      if (!res.ok) throw new Error('Failed to fetch destinations');
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
      throw error;
    }
  },

  // Get single destination by ID
  getById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/destinations/${id}`);
      if (!res.ok) throw new Error('Destination not found');
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch destination:', error);
      throw error;
    }
  },

  // Seed sample data in backend
  seedData: async () => {
    try {
      const res = await fetch(`${API_URL}/destinations/seed`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to seed data');
      return await res.json();
    } catch (error) {
      console.error('Failed to seed data:', error);
      throw error;
    }
  }
};

// ====================== REVIEWS API (Mock for now) ======================
const mockReviews = [];
const mockUserReviews = [];

export const reviewsAPI = {
  getByDestinationId: async (destinationId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockReviews.filter(review => review.destinationId === destinationId);
  },

  getUserReviews: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockUserReviews;
  },

  addReview: async (reviewData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newReview = {
      _id: Date.now().toString(),
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
    };
    mockReviews.push(newReview);
    return { success: true, review: newReview };
  },

  updateReview: async (reviewId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockReviews.findIndex(r => r._id === reviewId);
    if (index !== -1) {
      mockReviews[index] = { ...mockReviews[index], ...updates };
      return { success: true, review: mockReviews[index] };
    }
    return { success: false, error: 'Review not found' };
  },

  deleteReview: async (reviewId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockReviews.findIndex(r => r._id === reviewId);
    if (index !== -1) {
      mockReviews.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'Review not found' };
  },

  getAverageRating: async (destinationId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const destinationReviews = mockReviews.filter(r => r.destinationId === destinationId);
    if (destinationReviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const totalRating = destinationReviews.reduce((sum, r) => sum + r.rating, 0);
    const average = totalRating / destinationReviews.length;
    return { average: Math.round(average * 10) / 10, count: destinationReviews.length };
  },

  markHelpful: async (reviewId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockReviews.findIndex(r => r._id === reviewId);
    if (index !== -1) {
      mockReviews[index].helpful = (mockReviews[index].helpful || 0) + 1;
      return { success: true, helpful: mockReviews[index].helpful };
    }
    return { success: false, error: 'Review not found' };
  }
};

// ====================== USERS API (Mock) ======================
export const usersAPI = {
  getProfile: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      _id: userId,
      name: 'Demo User',
      email: 'user@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      bio: 'Travel enthusiast exploring the world one destination at a time.',
      joinedDate: '2024-01-01',
      reviewsCount: 3,
      helpfulVotes: 27
    };
  },

  updateProfile: async (userId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, user: { _id: userId, ...updates } };
  },

  getUserReviews: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockUserReviews;
  }
};

// ====================== AUTH API (Mock) ======================
export const authAPI = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (email && password) {
      return {
        success: true,
        user: {
          _id: '1',
          name: email.split('@')[0],
          email: email,
          token: 'mock-jwt-token',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
        }
      };
    }
    return { success: false, error: 'Invalid email or password' };
  },

  register: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!name || !email || !password) {
      return { success: false, error: 'Please fill in all fields' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    return {
      success: true,
      user: {
        _id: '1',
        name,
        email,
        token: 'mock-jwt-token',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
      }
    };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },

  resetPassword: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!email) return { success: false, error: 'Please provide your email' };
    return { success: true, message: 'Password reset instructions sent to your email' };
  }
};

// ====================== ANALYTICS API (Mock) ======================
export const analyticsAPI = {
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      totalDestinations: 8,
      totalReviews: mockReviews.length + mockUserReviews.length,
      averageRating: 4.7,
      popularCategories: [],
      recentReviews: mockReviews.slice(0, 3)
    };
  },

  getDestinationAnalytics: async (destinationId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      destination: 'Sample Destination',
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      monthlyVisits: 0,
      revenue: 0
    };
  }
};

// ====================== EXPORT ALL ======================
export default {
  destinations: destinationsAPI,
  reviews: reviewsAPI,
  users: usersAPI,
  auth: authAPI,
  analytics: analyticsAPI
};
