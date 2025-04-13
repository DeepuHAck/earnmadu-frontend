const express = require('express');
const earningController = require('../controllers/earningController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.get('/my-earnings', earningController.getMyEarnings);
router.patch('/payment-info', earningController.updatePaymentInfo);
router.post('/withdraw', earningController.requestWithdrawal);

// Admin only routes
router.get(
    '/stats',
    authController.restrictTo('admin'),
    earningController.getEarningsStats
);

module.exports = router; 