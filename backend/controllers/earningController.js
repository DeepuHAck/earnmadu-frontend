const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMyEarnings = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: 'watchHistory.video',
            select: 'title thumbnailUrl'
        });

    res.status(200).json({
        status: 'success',
        data: {
            earnings: user.earnings,
            watchHistory: user.watchHistory
        }
    });
});

exports.updatePaymentInfo = catchAsync(async (req, res, next) => {
    const { paypalEmail, bankDetails } = req.body;

    if (!paypalEmail && !bankDetails) {
        return next(new AppError('Please provide payment information', 400));
    }

    const updateData = {};
    if (paypalEmail) updateData['paymentInfo.paypalEmail'] = paypalEmail;
    if (bankDetails) updateData['paymentInfo.bankDetails'] = bankDetails;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'success',
        data: {
            paymentInfo: user.paymentInfo
        }
    });
});

exports.requestWithdrawal = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const { amount } = req.body;

    if (!user.paymentInfo.paypalEmail && !user.paymentInfo.bankDetails) {
        return next(new AppError('Please update your payment information first', 400));
    }

    if (amount < 10) {
        return next(new AppError('Minimum withdrawal amount is $10', 400));
    }

    if (amount > user.earnings.pending) {
        return next(new AppError('Insufficient balance', 400));
    }

    // Update user's earnings
    user.earnings.pending -= amount;
    user.earnings.withdrawn += amount;
    await user.save();

    // Here you would typically create a withdrawal record and initiate the payment process
    // This is a simplified version

    res.status(200).json({
        status: 'success',
        message: 'Withdrawal request submitted successfully',
        data: {
            amount,
            newBalance: user.earnings.pending
        }
    });
});

exports.getEarningsStats = catchAsync(async (req, res, next) => {
    const stats = await User.aggregate([
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: '$earnings.total' },
                totalWithdrawn: { $sum: '$earnings.withdrawn' },
                totalPending: { $sum: '$earnings.pending' },
                avgEarnings: { $avg: '$earnings.total' },
                maxEarnings: { $max: '$earnings.total' }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats: stats[0]
        }
    });
}); 