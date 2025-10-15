import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Helper to generate a unique user ID from email
const generateUserId = (email) => btoa(email).replace(/=/g, '');

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    favorites: [],
    tripPlanner: [],
    plannedTrips: 0,
    savedFavorites: 0,
    destinations: 8
  });
  const [notifications, setNotifications] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load reviews from localStorage on component mount
  const [reviews, setReviews] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedReviews = localStorage.getItem('travelAppReviews');
      return savedReviews ? JSON.parse(savedReviews) : [];
    }
    return [];
  });

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('travelAppReviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setIsAuthenticated(true);
      setCurrentUser(parsedUser);

      // Load user-specific data
      const savedUserData = localStorage.getItem(`userData_${parsedUser._id}`);
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }

    // Demo notifications
    setNotifications([
      {
        id: 1,
        title: 'Welcome to LocalTravel!',
        message: 'Start exploring amazing destinations around you',
        read: false,
        createdAt: new Date()
      }
    ]);
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser && currentUser._id) {
      localStorage.setItem(`userData_${currentUser._id}`, JSON.stringify(userData));
    }
  }, [userData, currentUser]);

  // 🟢 LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (!email || !password) return { success: false, error: 'Please enter both email and password' };

      const usersDB = JSON.parse(localStorage.getItem('usersDB') || '{}');
      const userRecord = usersDB[email];

      if (!userRecord) {
        return { success: false, error: 'Email not registered. Please sign up first.' };
      }

      if (userRecord.password !== password) {
        return { success: false, error: 'Incorrect password.' };
      }

      const userId = userRecord.userId;
      const user = {
        _id: userId,
        name: email.split('@')[0],
        email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
        bio: 'Travel enthusiast exploring local wonders',
        phone: '',
        location: ''
      };

      const savedProfile = localStorage.getItem(`userProfile_${userId}`);
      if (savedProfile) {
        Object.assign(user, JSON.parse(savedProfile));
      }

      // Load user data
      const savedUserData = localStorage.getItem(`userData_${userId}`);
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      } else {
        const newUserData = {
          favorites: [],
          tripPlanner: [],
          plannedTrips: 0,
          savedFavorites: 0,
          destinations: 8
        };
        setUserData(newUserData);
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // 🟢 REGISTER
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      if (!name || !email || !password) {
        return { success: false, error: 'Please fill in all fields' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const usersDB = JSON.parse(localStorage.getItem('usersDB') || '{}');
      if (usersDB[email]) {
        return { success: false, error: 'Email already registered' };
      }

      const userId = generateUserId(email);
      usersDB[email] = { userId, password };
      localStorage.setItem('usersDB', JSON.stringify(usersDB));

      const user = {
        _id: userId,
        name,
        email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
        bio: 'Travel enthusiast exploring local wonders',
        phone: '',
        location: ''
      };

      const newUserData = {
        favorites: [],
        tripPlanner: [],
        plannedTrips: 0,
        savedFavorites: 0,
        destinations: 8
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setUserData(newUserData);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // 🟡 LOGOUT
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserData({
      favorites: [],
      tripPlanner: [],
      plannedTrips: 0,
      savedFavorites: 0,
      destinations: 8
    });
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  // FAVORITES - FIXED
  const updateFavorites = async (destination, action) => {
    setUserData(prev => {
      let updatedFavorites;
      
      if (action === 'add') {
        // Check if already in favorites
        if (!prev.favorites.some(f => f._id === destination._id)) {
          updatedFavorites = [...prev.favorites, destination];
        } else {
          updatedFavorites = prev.favorites; // No change if already exists
        }
      } else if (action === 'remove') {
        updatedFavorites = prev.favorites.filter(f => f._id !== destination);
      } else {
        updatedFavorites = prev.favorites;
      }

      const updated = {
        ...prev,
        favorites: updatedFavorites,
        savedFavorites: updatedFavorites.length
      };

      return updated;
    });
  };

  // TRIP PLANNER - FIXED
  const updateTripPlanner = async (destination, action) => {
    setUserData(prev => {
      let updatedTripPlanner;
      
      if (action === 'add') {
        // Check if already in trip planner
        if (!prev.tripPlanner.some(t => t._id === destination._id)) {
          const tripDestination = {
            ...destination,
            addedAt: new Date().toISOString(),
            bestTime: 'All year'
          };
          updatedTripPlanner = [...prev.tripPlanner, tripDestination];
        } else {
          updatedTripPlanner = prev.tripPlanner; // No change if already exists
        }
      } else if (action === 'remove') {
        updatedTripPlanner = prev.tripPlanner.filter(t => t._id !== destination);
      } else {
        updatedTripPlanner = prev.tripPlanner;
      }

      const updated = {
        ...prev,
        tripPlanner: updatedTripPlanner,
        plannedTrips: updatedTripPlanner.length
      };

      return updated;
    });
  };

  // REVIEWS - PERSISTENT ACROSS LOGOUTS
  const addReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      user: {
        name: currentUser?.name || 'Anonymous',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'
      }
    };
    
    setReviews(prev => [newReview, ...prev]);
    return newReview;
  };

  const getReviewsByDestination = (destinationId) => {
    return reviews.filter(review => review.destinationId === destinationId);
  };

  const getUserReviews = () => {
    if (!currentUser) return [];
    return reviews.filter(review => review.userId === currentUser._id);
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  // PROFILE
  const updateUserProfile = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    if (updatedUser?._id) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem(`userProfile_${updatedUser._id}`, JSON.stringify(updatedUser));
    }
  };

  // SEARCH
  const searchDestinations = async (query) => {
    if (!query.trim()) return setSearchResults([]);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mock = [
      { 
        _id: '1', 
        name: 'Mountain Retreat', 
        type: 'Adventure', 
        location: 'Himalayas', 
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1000&q=80',
        price: '$120',
        description: 'Beautiful mountain retreat with amazing views',
        category: 'Adventure',
        reviewCount: 128
      },
      { 
        _id: '2', 
        name: 'Beach Paradise', 
        type: 'Relaxation', 
        location: 'Goa', 
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
        price: '$150',
        description: 'Relaxing beach destination with white sands',
        category: 'Beach',
        reviewCount: 245
      },
      { 
        _id: '3', 
        name: 'Historical City', 
        type: 'Cultural', 
        location: 'Delhi', 
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
        price: '$80',
        description: 'Rich historical heritage and cultural experience',
        category: 'Cultural',
        reviewCount: 189
      }
    ].filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(mock);
    setLoading(false);
  };

  // NOTIFICATIONS
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => setNotifications([]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        userData,
        reviews,
        notifications,
        searchResults,
        loading,
        login,
        register,
        logout,
        updateFavorites,
        updateTripPlanner,
        addReview,
        getReviewsByDestination,
        getUserReviews,
        deleteReview,
        updateUserProfile,
        searchDestinations,
        markNotificationAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};