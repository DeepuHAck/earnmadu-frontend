import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setVideos, setLoading, setError } from '../store/slices/videoSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get('/api/videos');
        dispatch(setVideos(response.data.data.videos));
      } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Error fetching videos'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchVideos();
  }, [dispatch]);

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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Videos</h1>
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