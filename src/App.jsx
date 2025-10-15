// src/App.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Star, Search, Calendar, Cloud, Navigation, Clock, DollarSign, Heart, User, Lock, Mail, LogOut, UserCircle, ChevronDown, Bell, Menu, X, Plus, Filter, Settings } from 'lucide-react';
import { useAuth } from './context/AuthContext.jsx';
import { destinationsAPI } from './services/api.js';
import ReviewSection from './components/ReviewSection.jsx';
import UserReviews from './components/UserReviews.jsx';
import Footer from './components/Footer.jsx';
import SearchModal from './components/SearchModal.jsx';
import NotificationsPanel from './components/NotificationsPanel.jsx';
import Profile from './pages/Profile.jsx';
import SettingsPage from './pages/Settings.jsx';
import TripPlanner from './pages/TripPlanner.jsx';

const TravelApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { 
    isAuthenticated, 
    currentUser, 
    userData, 
    login, 
    register, 
    logout,
    updateFavorites,
    updateTripPlanner,
    notifications,
    markNotificationAsRead,
    clearAllNotifications
  } = useAuth();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all', label: 'All Destinations', icon: MapPin, color: 'gray' },
    { id: 'adventure', label: 'Adventure', icon: Navigation, color: 'green' },
    { id: 'historical', label: 'Historical', icon: Clock, color: 'amber' },
    { id: 'food', label: 'Food & Dining', icon: DollarSign, color: 'red' },
    { id: 'relaxation', label: 'Relaxation', icon: Cloud, color: 'blue' }
  ];

  // Load destinations
  const loadDestinations = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory !== 'all') filters.category = selectedCategory;
      if (searchQuery) filters.search = searchQuery;
      
      const data = await destinationsAPI.getAll(filters);
      setDestinations(data);
    } catch (error) {
      console.error('Failed to load destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    loadDestinations();
  }, [searchQuery, selectedCategory]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      let result;
      if (authMode === 'login') {
        result = await login(authForm.email, authForm.password);
      } else {
        result = await register(authForm.name, authForm.email, authForm.password);
      }

      if (result.success) {
        setShowAuthModal(false);
        setAuthForm({ name: '', email: '', password: '' });
        setShowUserMenu(false);
      } else {
        setAuthError(result.error);
      }
    } catch (error) {
      setAuthError('An error occurred during authentication');
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('home');
    setShowUserMenu(false);
  };

  const toggleFavorite = async (dest) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setAuthError('Please login to save favorites');
      return;
    }

    try {
      const isFavorite = (userData?.favorites || []).some(fav => fav._id === dest._id);
      
      if (isFavorite) {
        await updateFavorites(dest._id, 'remove');
      } else {
        await updateFavorites(dest, 'add');
      }
    } catch (error) {
      console.error('Failed to update favorites:', error);
      setAuthError('Failed to update favorites. Please try again.');
    }
  };

  const toggleTripPlanner = async (dest) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setAuthError('Please login to add destinations to your trip planner');
      return;
    }

    try {
      const inTrip = (userData?.tripPlanner || []).some(trip => trip._id === dest._id);
      
      if (inTrip) {
        await updateTripPlanner(dest._id, 'remove');
      } else {
        await updateTripPlanner(dest, 'add');
      }
    } catch (error) {
      console.error('Failed to update trip planner:', error);
      setAuthError('Failed to update trip planner. Please try again.');
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'planner', label: 'Planner' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const DestinationCard = ({ destination, compact = false }) => {
    // Safe access to userData with fallbacks
    const favorites = userData?.favorites || [];
    const tripPlanner = userData?.tripPlanner || [];
    
    const isFavorite = favorites.some(fav => fav._id === destination._id);
    const isInTripPlanner = tripPlanner.some(trip => trip._id === destination._id);

    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-2">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIxNi41NjkgMTUwIDIzMCAxMzYuNTY5IDIzMCAxMjBDMjMwIDEwMy40MzEgMjE2LjU2OSA5MCAyMDAgOTBDMTgzLjQzMSA5MCAxNzAgMTAzLjQzMSAxNzAgMTIwQzE3MCAxMzYuNTY5IDE4My40MzEgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOEREQ0RGIi8+CjxwYXRoIGQ9Ik0xMjAgMTgwSDE0MFYyMTBIMTIwVjE4MFpNMTYwIDE2MEgxODBWMjEwSDE2MFYxNjBaTTIwMCAxNDBIMjIwVjIxMEgyMDBWMTQwWk0yNDAgMTYwSDI2MFYyMTBIMjQwVjE2MFpNMjgwIDE4MEgzMDBWMjEwSDI4MFYxODBaIiBmaWxsPSIjOEREQ0RGIi8+Cjwvc3ZnPgo=';
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(destination); }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 capitalize shadow-sm">
              {destination.category}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-gray-800">{destination.rating}</span>
            <span className="text-xs text-gray-500">({destination.reviews})</span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {destination.name}
          </h3>
          
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
            <MapPin size={14} />
            <span>{destination.location}</span>
          </div>
          
          {!compact && (
            <>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {destination.description}
              </p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{destination.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/person</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTripPlanner(destination)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                      isInTripPlanner
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isInTripPlanner ? 'Added ✓' : 'Add to Trip'}
                  </button>
                  <button
                    onClick={() => { setSelectedDestination(destination); setActiveTab('details'); }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    // Profile and Settings are now separate pages
    if (activeTab === 'profile') {
      return <Profile />;
    }
    
    if (activeTab === 'settings') {
      return <SettingsPage />;
    }

    // TripPlanner is now a separate page
    if (activeTab === 'planner') {
      return <TripPlanner onLoginRequired={() => {
        setShowAuthModal(true);
        setAuthMode('login');
      }} />;
    }

    return (
      <>
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white mb-12 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">Explore Local Wonders</h2>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl">
                  Discover hidden gems, plan your perfect trip, and create unforgettable memories with LocalTravel
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                  >
                    Start Exploring
                  </button>
                  {!isAuthenticated && (
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setAuthMode('signup');
                      }}
                      className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold hover:bg-blue-500/30 transition-all duration-200"
                    >
                      Sign Up Free
                    </button>
                  )}
                </div>
              </div>
              
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            {/* User Stats */}
            {isAuthenticated ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, {currentUser?.name}! 👋</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{userData?.tripPlanner?.length || 0}</div>
                    <div className="text-lg font-semibold text-blue-800">Planned Trips</div>
                    <div className="text-sm text-blue-600 mt-1">Destinations in your planner</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{userData?.favorites?.length || 0}</div>
                    <div className="text-lg font-semibold text-purple-800">Saved Favorites</div>
                    <div className="text-sm text-purple-600 mt-1">Places you love</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border border-pink-200">
                    <div className="text-4xl font-bold text-pink-600 mb-2">{userData?.destinations || 8}</div>
                    <div className="text-lg font-semibold text-pink-800">Destinations</div>
                    <div className="text-sm text-pink-600 mt-1">Ready to explore</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Discover Amazing Places! 🌍</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
                    <div className="text-lg font-semibold text-blue-800">Planned Trips</div>
                    <div className="text-sm text-blue-600 mt-1">Login to plan your trips</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
                    <div className="text-lg font-semibold text-purple-800">Saved Favorites</div>
                    <div className="text-sm text-purple-600 mt-1">Login to save favorites</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border border-pink-200">
                    <div className="text-4xl font-bold text-pink-600 mb-2">8</div>
                    <div className="text-lg font-semibold text-pink-800">Destinations</div>
                    <div className="text-sm text-pink-600 mt-1">Ready to explore</div>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Destinations */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-800">Featured Destinations</h3>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200 font-semibold"
                >
                  <span>View All</span>
                  <Plus size={20} />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 mt-4">Loading amazing destinations...</p>
                </div>
              ) : destinations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                  <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">No destinations found</h4>
                  <p className="text-gray-600 mb-6">Please seed the database to get started</p>
                  <button
                    onClick={async () => {
                      try {
                        await destinationsAPI.seedData();
                        loadDestinations();
                      } catch (error) {
                        console.error('Failed to seed data:', error);
                      }
                    }}
                    className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Seed Sample Data
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {destinations.map(dest => (
                    <DestinationCard key={dest._id} destination={dest} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explore Tab */}
        {activeTab === 'explore' && (
          <div>
            {/* Search and Filter Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                  <input
                    type="text"
                    placeholder="Search destinations, activities, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button className="px-6 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200 font-semibold flex items-center gap-2">
                  <Filter size={20} />
                  <span>Filters</span>
                </button>
              </div>

              {/* Categories */}
              <div className="flex gap-3 flex-wrap">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 ${
                        selectedCategory === cat.id
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 transform -translate-y-0.5'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg'
                      }`}
                    >
                      <Icon size={20} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {loading ? 'Searching...' : `${destinations.length} Destination${destinations.length !== 1 ? 's' : ''} Found`}
              </h2>
              <div className="text-gray-600">
                {searchQuery && `for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
              </div>
            </div>

            {/* Destinations Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Discovering amazing places...</p>
              </div>
            ) : destinations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <Search className="mx-auto text-gray-300 mb-4" size={64} />
                <h4 className="text-2xl font-bold text-gray-800 mb-2">No destinations found</h4>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={async () => {
                    try {
                      await destinationsAPI.seedData();
                      loadDestinations();
                    } catch (error) {
                      console.error('Failed to seed data:', error);
                    }
                  }}
                  className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-200"
                >
                  Seed Sample Data
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map(dest => (
                  <DestinationCard key={dest._id} destination={dest} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <UserReviews onLoginRequired={() => {
              setShowAuthModal(true);
              setAuthMode('login');
            }} />
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && selectedDestination && (
          <div>
            <button
              onClick={() => setActiveTab('explore')}
              className="mb-8 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              ← Back to Explore
            </button>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={selectedDestination.image} 
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIxNi41NjkgMTUwIDIzMCx7MzYuNTY5IDIzMCAxMjBDMjMwIDEwMy40MzEgMjE2LjU2OSA5MCAyMDAgOTBDMTgzLjQzMSA5MCAxNzAgMTAzLjQzMSAxNzAgMTIwQzE3MCAxMzYuNTY5IDE4My40MzEgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOEREQ0RGIi8+CjxwYXRoIGQ9Ik0xMjAgMTgwSDE0MFYyMTBIMTIwVjE4MFpNMTYwIDE2MEgxODBWMjEwSDE2MFYxNjBaTTIwMCAxNDBIMjIwVjIxMEgyMDBWMTQwWk0yNDAgMTYwSDI2MFYyMTBIMjQwVjE2MFpNMjgwIDE4MEgzMDBWMjEwSDI4MFYxODBaIiBmaWxsPSIjOEREQ0RGIi8+Cjwvc3ZnPgo=';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h1 className="text-4xl font-bold text-white mb-2">{selectedDestination.name}</h1>
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xl font-semibold">{selectedDestination.rating}</span>
                      <span className="text-gray-200">({selectedDestination.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{selectedDestination.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-blue-500" size={20} />
                        <span className="text-gray-700">{selectedDestination.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="text-blue-500" size={20} />
                        <span className="text-gray-700">Best Time: {selectedDestination.bestTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Cloud className="text-blue-500" size={20} />
                        <span className="text-gray-700">Weather: {selectedDestination.weather}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="text-blue-500" size={20} />
                        <span className="text-gray-700">Price Range: {selectedDestination.price}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Location Map</h2>
                    <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="mx-auto text-gray-400 mb-2" size={48} />
                        <p className="text-gray-600">Interactive map would display here</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Coordinates: {selectedDestination.coordinates.lat}, {selectedDestination.coordinates.lng}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => toggleTripPlanner(selectedDestination)}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 ${
                      (userData?.tripPlanner || []).some(trip => trip._id === selectedDestination._id)
                        ? 'bg-green-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {(userData?.tripPlanner || []).some(trip => trip._id === selectedDestination._id) 
                      ? '✓ Added to Trip' 
                      : 'Add to Trip Planner'}
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedDestination)}
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 ${
                      (userData?.favorites || []).some(fav => fav._id === selectedDestination._id)
                        ? 'bg-red-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {(userData?.favorites || []).some(fav => fav._id === selectedDestination._id) ? '♥ Favorited' : '♡ Add to Favorites'}
                  </button>
                </div>

                {/* Reviews Section */}
                <ReviewSection destinationId={selectedDestination._id} />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-scale-in">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {authMode === 'login' ? 'Welcome Back!' : 'Join LocalTravel'}
              </h2>
              <p className="text-blue-100">
                {authMode === 'login' 
                  ? 'Login to access your trips and favorites' 
                  : 'Create an account to start planning your adventures'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-8">
              {authError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {authError}
                </div>
              )}

              {authMode === 'signup' && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-3">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 font-semibold mb-3">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    required
                    minLength="6"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {authMode === 'login' ? 'Login to Account' : 'Create Account'}
              </button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setAuthError('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Login'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                  setAuthForm({ name: '', email: '', password: '' });
                }}
                className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">LocalTravel</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Discover Your Next Adventure</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <button 
                onClick={() => setShowSearchModal(true)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              {isAuthenticated && (
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="text-white" size={16} />
                    </div>
                    <span className="font-semibold text-gray-700 hidden sm:block">{currentUser?.name}</span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 backdrop-blur-sm z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{currentUser?.name}</p>
                        <p className="text-sm text-gray-500">{currentUser?.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveTab('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <UserCircle size={16} />
                        My Profile
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode('login');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
                  >
                    <User size={18} />
                    <span>Login</span>
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-lg">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-xl font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-xl font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Settings
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20">
        {renderMainContent()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TravelApp;