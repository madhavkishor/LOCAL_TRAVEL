// src/components/ImageWithFallback.jsx
import React, { useState } from 'react';
import { Image } from 'lucide-react';

const ImageWithFallback = ({ src, alt, className, fallbackSrc = null }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  // Default fallback image
  const defaultFallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIxNi41NjkgMTUwIDIzMCAxMzYuNTY5IDIzMCAxMjBDMjMwIDEwMy40MzEgMjE2LjU2OSA5MCAyMDAgOTBDMTgzLjQzMSA5MCAxNzAgMTAzLjQzMSAxNzAgMTIwQzE3MCAxMzYuNTY5IDE4My40MzEgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOEREQ0RGIi8+CjxwYXRoIGQ9Ik0xMjAgMTgwSDE0MFYyMTBIMTIwVjE4MFpNMTYwIDE2MEgxODBWMjEwSDE2MFYxNjBaTTIwMCAxNDBIMjIwVjIxMEgyMDBWMTQwWk0yNDAgMTYwSDI2MFYyMTBIMjQwVjE2MFpNMjgwIDE4MEgzMDBWMjEwSDI4MFYxODBaIiBmaWxsPSIjOEREQ0RGIi8+Cjwvc3ZnPgo=';

  if (error || !src) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <Image size={32} className="mx-auto mb-2" />
          <span className="text-sm">Image not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default ImageWithFallback;