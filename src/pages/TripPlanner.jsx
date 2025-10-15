import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, X, Mountain, Utensils, Castle, Leaf, User, LogIn } from 'lucide-react';

const TripPlanner = ({ onLoginRequired }) => {
  const { userData, updateTripPlanner, isAuthenticated, currentUser } = useAuth();

  const handleRemoveFromTrip = (destinationId) => {
    updateTripPlanner(destinationId, 'remove');
  };

  // Helper function to get icon based on category
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'adventure':
      case 'mountain':
        return <Mountain size={20} />;
      case 'food':
      case 'restaurant':
        return <Utensils size={20} />;
      case 'historical':
      case 'heritage':
        return <Castle size={20} />;
      default:
        return <Leaf size={20} />;
    }
  };

  // Helper function to get background color based on category
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'adventure':
        return 'from-green-500 to-emerald-600';
      case 'historical':
        return 'from-amber-500 to-orange-600';
      case 'food':
        return 'from-red-500 to-pink-600';
      case 'beach':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-purple-500 to-indigo-600';
    }
  };

  // If user is not authenticated, show login required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trip Planner
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your perfect journey and manage your travel destinations
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="text-blue-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Please login to access your trip planner and save your travel itinerary.
            </p>
            <button
              onClick={onLoginRequired}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <LogIn size={20} />
              Login to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Trip Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome back, {currentUser?.name}! Manage your travel destinations and create unforgettable journeys
          </p>
        </div>

        {/* Trip Planner Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                My Travel Plans
              </h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white font-semibold">
                  {userData.tripPlanner.length} destination{userData.tripPlanner.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {userData.tripPlanner.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Calendar size={80} className="mx-auto opacity-50" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">Your trip planner is empty</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Start exploring amazing destinations and add them to your trip planner to begin organizing your journey.
                </p>
                <button 
                  onClick={() => window.location.href = '/?tab=explore'}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userData.tripPlanner.map((destination, index) => (
                  <div 
                    key={destination._id} 
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-6 flex-1">
                      {/* Number Badge */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(destination.category)} rounded-lg flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                      </div>
                      
                      {/* Destination Image */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={destination.image} 
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Destination Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(destination.category)} text-white shadow-sm`}>
                            {getCategoryIcon(destination.category)}
                          </div>
                          <h3 className="font-bold text-xl text-gray-900 truncate">{destination.name}</h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                          <div className="flex items-center text-sm">
                            <MapPin size={16} className="mr-1 text-blue-500" />
                            <span>{destination.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar size={16} className="mr-1 text-green-500" />
                            <span>{destination.bestTime || 'All year'}</span>
                          </div>
                          {destination.rating && (
                            <div className="flex items-center text-sm bg-amber-50 px-2 py-1 rounded-full">
                              <span className="text-amber-600 font-semibold">⭐ {destination.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center space-x-4 ml-6">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{destination.price}</span>
                        <span className="text-gray-500 text-sm block">per person</span>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveFromTrip(destination._id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 border border-transparent hover:border-red-200"
                        title="Remove from trip"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Empty State Tips */}
        {userData.tripPlanner.length === 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Discover Destinations</h4>
              <p className="text-gray-600 text-sm">Explore hidden gems and popular spots near you</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-green-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Plan Your Dates</h4>
              <p className="text-gray-600 text-sm">Choose the best time to visit each destination</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-purple-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Itinerary</h4>
              <p className="text-gray-600 text-sm">Build the perfect travel route for your adventure</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;