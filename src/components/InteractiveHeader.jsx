import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InteractiveHeader = () => {
  const { userData } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">LocalTravel</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/explore" className="text-gray-700 hover:text-blue-600 font-medium">
              Explore
            </Link>
            <Link to="/planner" className="text-gray-700 hover:text-blue-600 font-medium">
              Planner ({userData.tripPlanner.length})
            </Link>
            <Link to="/reviews" className="text-gray-700 hover:text-blue-600 font-medium">
              Reviews
            </Link>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {/* ... user menu code */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default InteractiveHeader;