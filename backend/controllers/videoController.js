const { google } = require('googleapis');
const Video = require('../models/videoModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
});

exports.addVideo = catchAsync(async (req, res, next) => {
    const { youtubeUrl, category } = req.body;
    const youtubeId = extractYoutubeId(youtubeUrl);

    if (!youtubeId) {
        return next(new AppError('Invalid YouTube URL', 400));
    }

    // Check if video already exists
    const existingVideo = await Video.findOne({ youtubeId });
    if (existingVideo) {
        return next(new AppError('Video already exists in the system', 400));
    }

    // Fetch video details from YouTube API
    const videoDetails = await youtube.videos.list({
        part: 'snippet,contentDetails',
        id: youtubeId
    });

    if (!videoDetails.data.items.length) {
        return next(new AppError('Video not found on YouTube', 404));
    }

    const videoData = videoDetails.data.items[0];
    const video = await Video.create({
        youtubeId,
        title: videoData.snippet.title,
        description: videoData.snippet.description,
        thumbnailUrl: videoData.snippet.thumbnails.high.url,
        duration: videoData.contentDetails.duration,
        channelTitle: videoData.snippet.channelTitle,
        channelId: videoData.snippet.channelId,
        category,
        addedBy: req.user._id
    });

    res.status(201).json({
        status: 'success',
        data: { video }
    });
});

exports.getVideos = catchAsync(async (req, res, next) => {
    const videos = await Video.find({ status: 'active' })
        .sort('-createdAt')
        .populate('addedBy', 'name');

    res.status(200).json({
        status: 'success',
        results: videos.length,
        data: { videos }
    });
});

exports.watchVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
        return next(new AppError('Video not found', 404));
    }

    const user = await User.findById(req.user._id);
    if (user.hasExceededDailyLimit()) {
        return next(new AppError('Daily view limit exceeded', 400));
    }

    // Check if video has been watched by this IP today
    const hasWatched = await Video.hasBeenWatchedByIP(video._id, req.ip);
    if (hasWatched) {
        return next(new AppError('You have already watched this video today', 400));
    }

    // Record the view
    video.views.push({
        user: req.user._id,
        ip: req.ip,
        earned: video.earnings.perView
    });
    video.viewCount += 1;
    await video.save();

    // Update user's earnings and view count
    user.earnings.pending += video.earnings.perView;
    user.earnings.total += video.earnings.perView;
    user.dailyViewCount.count += 1;
    user.watchHistory.push({
        video: video._id,
        earned: video.earnings.perView
    });
    await user.save();

    res.status(200).json({
        status: 'success',
        data: {
            earned: video.earnings.perView,
            dailyViewCount: user.dailyViewCount.count
        }
    });
});

exports.updateVideoStatus = catchAsync(async (req, res, next) => {
    const video = await Video.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
    );

    if (!video) {
        return next(new AppError('Video not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { video }
    });
});

// Utility function to extract YouTube ID from URL
const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}; 