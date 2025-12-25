const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'fullName', 'avatarUrl', 'createdAt']
        });

        if (!user) {
            return res.status(404).json(
                ApiResponse.notFound('User not found')
            );
        }

        res.status(200).json(
            ApiResponse.success(user, 'User profile retrieved successfully')
        );
    } catch (error) {
        res.status(500).json(
            ApiResponse.error('Failed to retrieve user profile', 500)
        );
    }
});

/**
 * @route   PUT /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authenticate, async (req, res) => {
    try {
        const { fullName, avatarUrl } = req.body;

        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.status(404).json(
                ApiResponse.notFound('User not found')
            );
        }

        // Update fields
        if (fullName !== undefined) user.fullName = fullName;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

        await user.save();

        res.status(200).json(
            ApiResponse.success({
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl
            }, 'Profile updated successfully')
        );
    } catch (error) {
        res.status(500).json(
            ApiResponse.error('Failed to update profile', 500)
        );
    }
});

module.exports = router;
