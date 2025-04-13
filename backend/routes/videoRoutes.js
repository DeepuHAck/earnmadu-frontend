const express = require('express');
const videoController = require('../controllers/videoController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/', videoController.getVideos);
router.post('/', authController.restrictTo('admin'), videoController.addVideo);
router.post('/:id/watch', videoController.watchVideo);
router.patch('/:id/status', authController.restrictTo('admin'), videoController.updateVideoStatus);

module.exports = router; 