import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CooldownTimer.css';

const CooldownTimer = ({ cooldownData, onCooldownComplete }) => {
    const [timeLeft, setTimeLeft] = useState(cooldownData.duration);
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();

    // Format time to mm:ss
    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle page visibility change
    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            setIsActive(false);
            // Interrupt cooldown when page is hidden
            axios.post(`/api/videos/cooldown/${cooldownData.viewId}/interrupt`)
                .catch(error => console.error('Error interrupting cooldown:', error));
            
            // Store interruption in localStorage
            localStorage.setItem('cooldownInterrupted', 'true');
        }
    }, [cooldownData.viewId]);

    // Handle page unload/navigation
    const handleBeforeUnload = useCallback((e) => {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
        return ''; // Required for other browsers
    }, []);

    useEffect(() => {
        // Set up visibility change listener
        document.addEventListener('visibilitychange', handleVisibilityChange);
        // Set up beforeunload listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Store cooldown start time in localStorage
        const startTime = new Date().getTime();
        localStorage.setItem('cooldownStartTime', startTime.toString());
        localStorage.setItem('cooldownViewId', cooldownData.viewId);
        localStorage.setItem('cooldownDuration', cooldownData.duration.toString());

        // Timer logic
        const timer = setInterval(() => {
            if (isActive) {
                setTimeLeft((prevTime) => {
                    const newTime = prevTime - 1000;
                    
                    // Check if cooldown is complete
                    if (newTime <= 0) {
                        clearInterval(timer);
                        axios.post(`/api/videos/cooldown/${cooldownData.viewId}/complete`)
                            .then(() => {
                                localStorage.removeItem('cooldownStartTime');
                                localStorage.removeItem('cooldownViewId');
                                localStorage.removeItem('cooldownDuration');
                                localStorage.removeItem('cooldownInterrupted');
                                onCooldownComplete();
                            })
                            .catch(error => console.error('Error completing cooldown:', error));
                        return 0;
                    }
                    return newTime;
                });
            }
        }, 1000);

        // Cleanup
        return () => {
            clearInterval(timer);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [cooldownData, isActive, handleVisibilityChange, handleBeforeUnload, onCooldownComplete]);

    // Render timer with warning message
    return (
        <div className="cooldown-timer">
            <div className="timer-display">
                <div className="timer-value">{formatTime(timeLeft)}</div>
                <div className="progress-bar">
                    <div 
                        className="progress" 
                        style={{ 
                            width: `${(timeLeft / cooldownData.duration) * 100}%`
                        }} 
                    />
                </div>
            </div>
            <div className="cooldown-message">
                <p className="warning">⚠️ {cooldownData.message}</p>
                <p className="time-left">Time remaining: {formatTime(timeLeft)}</p>
            </div>
        </div>
    );
};

export default CooldownTimer; 