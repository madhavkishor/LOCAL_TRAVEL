import React from 'react';
import { Star, Calendar, MapPin, Trash2, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserReviews = ({ onLoginRequired }) => {
  const { isAuthenticated, currentUser, getUserReviews, deleteReview } = useAuth();

  const userReviews = getUserReviews();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Reviews</h1>
            <p className="text-lg text-gray-600">Read authentic reviews from fellow travelers</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="text-blue-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Please login to view and write reviews. Share your travel experiences and help other travelers discover amazing destinations.
            </p>
            <button
              onClick={onLoginRequired}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Login to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Reviews</h1>
          <p className="text-lg text-gray-600">Your travel experiences and shared memories</p>
        </div>

        {userReviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <MessageCircle className="mx-auto text-gray-300 mb-4" size={80} />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Reviews Yet</h3>
            <p className="text-gray-600 mb-8 text-lg">
              You haven't written any reviews yet. Start exploring destinations and share your experiences!
            </p>
            <button
              onClick={() => window.location.href = '/?tab=explore'}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{review.destinationName || 'Destination'}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{review.destinationLocation || 'Various Locations'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < review.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviews;