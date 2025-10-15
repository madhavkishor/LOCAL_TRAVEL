import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ destinationId }) => {
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { 
    isAuthenticated, 
    currentUser, 
    addReview, 
    getReviewsByDestination,
    deleteReview 
  } = useAuth();

  const reviews = getReviewsByDestination(destinationId);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    const reviewData = {
      destinationId,
      rating: newReview.rating,
      comment: newReview.comment,
      userId: currentUser._id,
      userName: currentUser.name
    };

    addReview(reviewData);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Traveler Reviews</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-blue-500" size={20} />
            <span className="text-gray-600">{reviews.length} reviews</span>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-semibold"
            >
              Write Review
            </button>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= newReview.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Your Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience at this destination..."
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-semibold"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <MessageCircle className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500">Login to write a review</p>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.user?.name || review.userName || 'Traveler'}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
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
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
              
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <ThumbsUp size={16} />
                  <span>Helpful</span>
                </button>
                
                {isAuthenticated && currentUser?._id === review.userId && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                  >
                    Delete Review
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Login Prompt for non-authenticated users */}
      {!isAuthenticated && reviews.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <MessageCircle className="mx-auto text-blue-500 mb-3" size={32} />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Want to share your experience?</h3>
          <p className="text-blue-600 mb-4">Login to write your own review and help other travelers</p>
          <button
            onClick={() => window.location.href = '/?auth=login'}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-semibold"
          >
            Login to Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;