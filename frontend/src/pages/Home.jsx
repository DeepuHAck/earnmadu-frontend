import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      console.log('Fetching videos...');
      try {
        setLoading(true);
        console.log('API URL:', import.meta.env.VITE_API_URL);
        const response = await api.get('/videos');
        console.log('API Response:', response.data);
        setVideos(response.data.data.videos);
      } catch (err) {
        console.error('Error fetching videos:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            baseURL: err.config?.baseURL,
          }
        });
        setError(err.response?.data?.message || 'Error fetching videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Debug render
  console.log('Render state:', { loading, error, videosCount: videos.length });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Videos</h1>
        <div className="text-sm text-gray-500">
          Total Videos: {videos.length}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link to={`/video/${video._id}`}>
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.error('Image load error:', video.thumbnailUrl);
                  e.target.src = 'https://via.placeholder.com/480x360.png?text=Video+Thumbnail';
                }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                <p className="text-gray-600 line-clamp-2">{video.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Views: {video.viewCount}
                  </span>
                  <span className="text-sm text-green-500">
                    Earn: ${video.earningAmount}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {videos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No videos available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Home; 