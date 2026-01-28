const { User } = require('../models');
const { ApiResponse } = require('../utils/ApiResponse');
const bcrypt = require('bcryptjs');

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['passwordHash', 'resetToken', 'resetTokenExpiry'] }
        });

        if (!user) {
            return res.status(404).json(
                ApiResponse.error('User not found', 404)
            );
        }

        res.json(ApiResponse.success(user, 'Profile retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile (name, avatar)
 */
const updateProfile = async (req, res, next) => {
    try {
        const { fullName, avatarUrl } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json(
                ApiResponse.error('User not found', 404)
            );
        }

        // Update fields
        if (fullName !== undefined) user.fullName = fullName;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

        await user.save();

        // Return updated user without sensitive data
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['passwordHash', 'resetToken', 'resetTokenExpiry'] }
        });

        res.json(ApiResponse.success(updatedUser, 'Profile updated successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Update user password
 */
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json(
                ApiResponse.error('Current password and new password are required', 400)
            );
        }

        if (newPassword.length < 6) {
            return res.status(400).json(
                ApiResponse.error('New password must be at least 6 characters', 400)
            );
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json(
                ApiResponse.error('User not found', 404)
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json(
                ApiResponse.error('Current password is incorrect', 401)
            );
        }

        // Hash and update new password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json(ApiResponse.success(null, 'Password updated successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updatePassword
};
