const { User } = require('../models');
const { ApiResponse } = require('../utils/ApiResponse');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

// Validation schemas
const updateProfileSchema = Joi.object({
    fullName: Joi.string().min(2).max(255).optional(),
    avatarUrl: Joi.string().uri().max(500).optional()
});

const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
});

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.userId, {
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
        // Validate input
        const { error, value } = updateProfileSchema.validate(req.body);
        if (error) {
            return res.status(400).json(
                ApiResponse.error(error.details[0].message, 400)
            );
        }

        const { fullName, avatarUrl } = value;
        const userId = req.user.userId;

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
        // Validate input
        const { error, value } = updatePasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json(
                ApiResponse.error(error.details[0].message, 400)
            );
        }

        const { currentPassword, newPassword } = value;
        const userId = req.user.userId;

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
