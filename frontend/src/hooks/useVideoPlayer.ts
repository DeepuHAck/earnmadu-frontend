import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { videoApi } from '../lib/api';
import { useAuth } from '../store/auth-context';

interface VideoPlayerState {
  videoId: string | null;
  youtubeId: string | null;
  isWatching: boolean;
  progress: number;
  isCompleted: boolean;
  isRewarded: boolean;
  showAd: boolean;
}

export const useVideoPlayer = () => {
  const { user, updateUser } = useAuth();
  const [state, setState] = useState<VideoPlayerState>({
    videoId: null,
    youtubeId: null,
    isWatching: false,
    progress: 0,
    isCompleted: false,
    isRewarded: false,
    showAd: false,
  });

  const fetchNextVideo = useCallback(async () => {
    try {
      const { data } = await videoApi.getNextVideo();
      setState((prev) => ({
        ...prev,
        videoId: data.data._id,
        youtubeId: data.data.youtubeId,
        isWatching: false,
        progress: 0,
        isCompleted: false,
        isRewarded: false,
        showAd: false,
      }));
    } catch (error) {
      console.error('Error fetching next video:', error);
    }
  }, []);

  const startWatching = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isWatching: true,
      progress: 0,
    }));
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setState((prev) => ({
      ...prev,
      progress,
      isCompleted: progress >= 100,
    }));
  }, []);

  const completeVideo = useCallback(async () => {
    if (!state.videoId || state.isRewarded) return;

    try {
      const { data } = await videoApi.completeVideo(state.videoId);
      setState((prev) => ({
        ...prev,
        isRewarded: true,
        showAd: true,
      }));

      // Update user's wallet balance
      if (user) {
        updateUser({
          ...user,
          wallet: {
            ...user.wallet,
            balance: user.wallet.balance + data.data.reward,
            totalEarned: user.wallet.totalEarned + data.data.reward,
          },
        });
      }

      toast.success('🎉 Happy Earnings! You earned ₹1!', {
        duration: 5000,
        icon: '💰',
      });
    } catch (error) {
      console.error('Error completing video:', error);
    }
  }, [state.videoId, state.isRewarded, user, updateUser]);

  const handleAdComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showAd: false,
    }));
    fetchNextVideo();
  }, [fetchNextVideo]);

  useEffect(() => {
    if (!state.videoId) {
      fetchNextVideo();
    }
  }, [state.videoId, fetchNextVideo]);

  useEffect(() => {
    if (state.isCompleted && !state.isRewarded) {
      completeVideo();
    }
  }, [state.isCompleted, state.isRewarded, completeVideo]);

  return {
    ...state,
    startWatching,
    updateProgress,
    handleAdComplete,
  };
}; 