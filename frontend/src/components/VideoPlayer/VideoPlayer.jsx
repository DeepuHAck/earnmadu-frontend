import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CooldownTimer from './CooldownTimer';
import './VideoPlayer.css';

const VideoPlayer = ({ videoId, onVideoComplete }) => {
    const [video, setVideo] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownData, setCooldownData] = useState(null);

    // Check for existing cooldown on component mount
    useEffect(() => {
        const storedViewId = localStorage.getItem('cooldownViewId');
        const storedStartTime = localStorage.getItem('cooldownStartTime');
        const storedDuration = localStorage.getItem('cooldownDuration');
        const wasInterrupted = localStorage.getItem('cooldownInterrupted');

        if (storedViewId && storedStartTime && storedDuration && !wasInterrupted) {
            const elapsedTime = new Date().getTime() - parseInt(storedStartTime);
            const remainingTime = parseInt(storedDuration) - elapsedTime;

            if (remainingTime > 0) {
                setIsCooldown(true);
                setCooldownData({
                    viewId: storedViewId,
                    duration: remainingTime,
                    message: '⏳ Hold down for 10 minutes here without closing or going back to get the next video.'
                });
            } else {
                // Clean up expired cooldown
                localStorage.removeItem('cooldownStartTime');
                localStorage.removeItem('cooldownViewId');
                localStorage.removeItem('cooldownDuration');
            }
        }
    }, []);

    // Fetch video data
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`/api/videos/${videoId}`);
                setVideo(response.data.data.video);
                setIsLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error loading video');
                setIsLoading(false);
            }
        };

        fetchVideo();
    }, [videoId]);

    const handleVideoComplete = async () => {
        try {
            const response = await axios.post(`/api/videos/${videoId}/view`);
            
            if (response.data.status === 'success') {
                setIsCooldown(true);
                setCooldownData(response.data.data.cooldown);
            }
        } catch (err) {
            if (err.response?.status === 429) {
                // User is in cooldown
                setIsCooldown(true);
                setCooldownData({
                    viewId: err.response.data.data.viewId,
                    remainingTime: err.response.data.data.remainingTime,
                    message: err.response.data.message
                });
            } else {
                setError(err.response?.data?.message || 'Error recording view');
            }
        }
    };

    const handleCooldownComplete = () => {
        setIsCooldown(false);
        setCooldownData(null);
        if (onVideoComplete) {
            onVideoComplete();
        }
    };

    if (isLoading) {
        return <div className="video-loading">Loading...</div>;
    }

    if (error) {
        return <div className="video-error">{error}</div>;
    }

    return (
        <div className="video-player-container">
            {isCooldown ? (
                <CooldownTimer 
                    cooldownData={cooldownData}
                    onCooldownComplete={handleCooldownComplete}
                />
            ) : (
                <div className="video-wrapper">
                    <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&enablejsapi=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onEnded={handleVideoComplete}
                    />
                    <h2 className="video-title">{video.title}</h2>
                    <p className="video-description">{video.description}</p>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer; 