import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    youtubeUrl: '',
    category: 'entertainment',
    earnings: { perView: 0.01 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, videosRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/earnings/stats`),
        axios.get(`${import.meta.env.VITE_API_URL}/videos/admin`)
      ]);
      setStats(statsRes.data.data.stats);
      setVideos(videosRes.data.data.videos);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/videos`, newVideo);
      toast.success('Video added successfully');
      setNewVideo({
        youtubeUrl: '',
        category: 'entertainment',
        earnings: { perView: 0.01 }
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add video');
    }
  };

  const handleUpdateVideoStatus = async (videoId, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/videos/${videoId}/status`, {
        status
      });
      toast.success('Video status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update video status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalUsers || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Videos</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalVideos || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-green-600">
            ${stats?.totalEarnings?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalViews || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Video</h2>
        <form onSubmit={handleAddVideo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              YouTube URL
            </label>
            <input
              type="url"
              value={newVideo.youtubeUrl}
              onChange={(e) =>
                setNewVideo((prev) => ({ ...prev, youtubeUrl: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={newVideo.category}
              onChange={(e) =>
                setNewVideo((prev) => ({ ...prev, category: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="entertainment">Entertainment</option>
              <option value="education">Education</option>
              <option value="gaming">Gaming</option>
              <option value="music">Music</option>
              <option value="tech">Tech</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Earnings per View ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={newVideo.earnings.perView}
              onChange={(e) =>
                setNewVideo((prev) => ({
                  ...prev,
                  earnings: { ...prev.earnings, perView: parseFloat(e.target.value) }
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Video
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Manage Videos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings/View
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videos.map((video) => (
                <tr key={video._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {video.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {video.channelTitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {video.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {video.viewCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ${video.earnings.perView.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        video.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : video.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {video.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {video.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateVideoStatus(video._id, 'active')}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Approve
                      </button>
                    )}
                    {video.status === 'active' && (
                      <button
                        onClick={() => handleUpdateVideoStatus(video._id, 'inactive')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deactivate
                      </button>
                    )}
                    {video.status === 'inactive' && (
                      <button
                        onClick={() => handleUpdateVideoStatus(video._id, 'active')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 