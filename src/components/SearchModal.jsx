// src/components/SearchModal.jsx
import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const SearchModal = ({ isOpen, onClose, onDestinationSelect }) => {
  const [query, setQuery] = useState('');
  const { searchDestinations, searchResults, loading } = useAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchDestinations(query);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchDestinations]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleResultClick = (destination) => {
    if (onDestinationSelect) {
      onDestinationSelect(destination);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Search Header */}
        <div className="flex items-center p-6 border-b border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search destinations, activities, locations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              autoFocus
            />
            {loading && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-4">
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  onClick={() => handleResultClick(result)}
                  className="p-4 hover:bg-blue-50 rounded-xl cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 group"
                >
                  <div className="flex gap-4">
                    <img 
                      src={result.image} 
                      alt={result.name}
                      className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIxNi41NjkgMTUwIDIzMCAxMzYuNTY5IDIzMCAxMjBDMjMwIDEwMy40MzEgMjE2LjU2OSA5MCAyMDAgOTBDMTgzLjQzMSA5MCAxNzAgMTAzLjQzMSAxNzAgMTIwQzE3MCAxMzYuNTY5IDE4My40MzEgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOEREQ0RGIi8+CjxwYXRoIGQ9Ik0xMjAgMTgwSDE0MFYyMTBIMTIwVjE4MFpNMTYwIDE2MEgxODBWMjEwSDE2MFYxNjBaTTIwMCAxNDBIMjIwVjIxMEgyMDBWMTQwWk0yNDAgMTYwSDI2MFYyMTBIMjQwVjE2MFpNMjgwIDE4MEgzMDBWMjEwSDI4MFYxODBaIiBmaWxsPSIjOEREQ0RGIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {result.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium text-gray-700">{result.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <MapPin size={16} />
                        <span>{result.location}</span>
                      </div>
                      <p className="text-sm text-gray-500 capitalize">{result.type}</p>
                      {result.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() && !loading ? (
            <div className="p-12 text-center text-gray-500">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">No results found</h4>
              <p>Try searching for different keywords like "beach", "mountain", or "city"</p>
            </div>
          ) : null}
        </div>

        {/* Search Tips */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-600 text-center">
            💡 Try searching for destinations, activities, or locations
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;