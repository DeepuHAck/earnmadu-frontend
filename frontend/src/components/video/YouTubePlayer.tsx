import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onProgress: (progress: number) => void;
  onComplete: () => void;
  isWatching: boolean;
}

const YouTubePlayer = ({
  videoId,
  onProgress,
  onComplete,
  isWatching,
}: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<number>();

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onComplete();
              clearInterval(progressIntervalRef.current);
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      clearInterval(progressIntervalRef.current);
    };
  }, [videoId, onComplete]);

  useEffect(() => {
    if (isWatching && playerRef.current) {
      playerRef.current.playVideo();

      // Start progress tracking
      progressIntervalRef.current = window.setInterval(() => {
        if (playerRef.current?.getCurrentTime && playerRef.current?.getDuration) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          const progress = (currentTime / duration) * 100;
          onProgress(progress);
        }
      }, 1000);
    } else if (!isWatching && playerRef.current) {
      playerRef.current.pauseVideo();
      clearInterval(progressIntervalRef.current);
    }

    return () => {
      clearInterval(progressIntervalRef.current);
    };
  }, [isWatching, onProgress]);

  return (
    <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg shadow-lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative"
      >
        <div id="youtube-player" />
        {!isWatching && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-primary-600 p-4 text-white shadow-lg"
              onClick={() => {
                if (playerRef.current) {
                  playerRef.current.playVideo();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default YouTubePlayer; 