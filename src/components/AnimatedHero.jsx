import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Users, Shield } from 'lucide-react';

const AnimatedHero = () => {
  const [currentText, setCurrentText] = useState(0);
  
  const heroTexts = [
    "Discover Hidden Gems",
    "Explore Local Cultures", 
    "Create Unforgettable Memories",
    "Find Your Next Adventure"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            <span className="block">Discover Your</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Next Adventure
            </span>
          </h1>
          
          {/* Animated Text */}
          <div className="h-16 mb-8">
            <p className="text-2xl md:text-3xl text-gray-600 font-medium transition-all duration-500">
              {heroTexts[currentText]}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Where do you want to explore today?"
              className="w-full pl-16 pr-6 py-5 text-lg bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-2xl"
            />
            <button className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
              Search
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-lg">
            <div className="p-3 bg-blue-100 rounded-xl mb-4">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Local Guides</h3>
            <p className="text-gray-600 text-sm text-center">Verified local experts and hidden spots</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-lg">
            <div className="p-3 bg-green-100 rounded-xl mb-4">
              <Star className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Top Rated</h3>
            <p className="text-gray-600 text-sm text-center">10,000+ verified reviews from travelers</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-lg">
            <div className="p-3 bg-purple-100 rounded-xl mb-4">
              <Shield className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Booking</h3>
            <p className="text-gray-600 text-sm text-center">Safe and secure payment options</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;