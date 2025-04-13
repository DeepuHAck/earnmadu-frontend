import { motion } from 'framer-motion';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import YouTubePlayer from '../components/video/YouTubePlayer';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const VideoPage = () => {
  const {
    youtubeId,
    isWatching,
    progress,
    isCompleted,
    isRewarded,
    showAd,
    startWatching,
    updateProgress,
    handleAdComplete,
  } = useVideoPlayer();

  if (!youtubeId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Video Player */}
        <div className="flex justify-center">
          <YouTubePlayer
            videoId={youtubeId}
            isWatching={isWatching}
            onProgress={updateProgress}
            onComplete={() => {}}
          />
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary-600"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Status and Controls */}
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
          <div className="text-sm font-medium text-gray-600">
            {isCompleted
              ? '✅ Video completed!'
              : `Progress: ${Math.round(progress)}%`}
          </div>
          {!isWatching && !isCompleted && (
            <button
              onClick={startWatching}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Start Watching
            </button>
          )}
        </div>

        {/* Reward Animation */}
        {isRewarded && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="rounded-lg bg-green-50 p-6 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="mb-4 text-4xl"
            >
              🎉
            </motion.div>
            <h3 className="mb-2 text-xl font-bold text-green-800">
              Happy Earnings!
            </h3>
            <p className="text-green-600">You earned ₹1!</p>
          </motion.div>
        )}

        {/* Advertisement */}
        {showAd && (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <h3 className="mb-4 text-lg font-semibold">Advertisement</h3>
            {/* Add your ad component here */}
            <button
              onClick={handleAdComplete}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Continue to Next Video
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VideoPage; 