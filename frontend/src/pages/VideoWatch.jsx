import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function VideoWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watching, setWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds watch time
  const timerRef = useRef(null);
  const watchStartedRef = useRef(false);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/videos/${id}`);
      setVideo(response.data.data.video);
    } catch (error) {
      toast.error('Failed to load video');
      navigate('/videos');
    } finally {
      setLoading(false);
    }
  };

  const startWatching = () => {
    if (watchStartedRef.current) return;
    watchStartedRef.current = true;
    setWatching(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          completeWatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeWatch = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/videos/${id}/watch`);
      const { earned, dailyViewCount } = response.data.data;
      
      toast.success(
        `Earned $${earned.toFixed(2)}! (${dailyViewCount}/${process.env.MAX_VIEWS_PER_DAY} videos today)`
      );
      
      // Update video view count
      setVideo(prev => ({
        ...prev,
        viewCount: prev.viewCount + 1
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record view');
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative pt-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            onPlay={startWatching}
          ></iframe>
        </div>
        
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
          <div className="flex items-center justify-between text-gray-600 mb-4">
            <div>
              <span className="font-medium">{video.channelTitle}</span>
              <span className="mx-2">•</span>
              <span>{video.viewCount} views</span>
            </div>
            <div className="text-blue-600 font-medium">
              Earn ${video.earnings.perView.toFixed(2)} per view
            </div>
          </div>

          {watching && (
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-700">
                  Watch time remaining:
                </span>
                <span className="text-blue-700">{timeLeft} seconds</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2 transition-all duration-1000"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoWatch; 