import React, { useState } from 'react';
import { Star, MapPin, Heart, Share2, Calendar, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DestinationCard = ({ destination }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { updateTripPlanner, updateFavorites, userData } = useAuth();

  const {
    _id,
    name,
    image,
    location,
    rating,
    reviewCount,
    description,
    price,
    category
  } = destination;

  // Check if destination is already in trip planner
  const isInTrip = userData.tripPlanner.some(item => item._id === _id);
  
  // Check if destination is in favorites
  const isInFavorites = userData.favorites.some(item => item._id === _id);

  const handleAddToTrip = () => {
    if (isInTrip) {
      updateTripPlanner(_id, 'remove');
    } else {
      updateTripPlanner(destination, 'add');
    }
  };

  const handleToggleFavorite = () => {
    if (isInFavorites) {
      updateFavorites(_id, 'remove');
    } else {
      updateFavorites(destination, 'add');
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 capitalize">
            {category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isInFavorites 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/90 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart size={16} fill={isInFavorites ? 'currentColor' : 'none'} />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:bg-white transition-colors">
            <Share2 size={16} />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-gray-800">{rating}</span>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Features */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>All Year</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={12} />
              <span>Family</span>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">{price}</span>
            <span className="text-gray-500 text-sm">/person</span>
          </div>
          <button 
            onClick={handleAddToTrip}
            className={`px-6 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105 ${
              isInTrip
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
          >
            {isInTrip ? 'Added ✓' : 'Add to Trip'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;