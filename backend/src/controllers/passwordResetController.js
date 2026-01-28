const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { ApiResponse } = require('../utils/ApiResponse');
const Joi = require('joi');

// Validation schemas
const requestResetSchema = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
});

/**
 * Request password reset
 * Generates a reset token and saves it to the user
 */
const requestReset = async (req, res, next) => {
    try {
        // Validate input
        const { error, value } = requestResetSchema.validate(req.body);
        if (error) {
            return res.status(400).json(
                ApiResponse.error(error.details[0].message, 400)
            );
        }

        const { email } = value;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json(
                ApiResponse.success(
                    null,
                    'If the email exists, a password reset link has been sent'
                )
            );
        }

        // Generate reset token (32 bytes = 64 hex characters)
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token before storing (security best practice)
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expiry (1 hour from now)
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

        // Save hashed token and expiry to user
        user.resetToken = hashedToken;
        user.resetTokenExpiry = tokenExpiry;
        await user.save();

        // TODO: Send email with reset link containing the unhashed token
        // For now, we'll return the token in response (ONLY FOR DEVELOPMENT)
        // In production, this should be sent via email
        console.log(`Password reset token for ${email}: ${resetToken}`);
        console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

        res.json(
            ApiResponse.success(
                {
                    // Remove this in production - token should only be sent via email
                    resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
                    message: 'Password reset token generated'
                },
                'If the email exists, a password reset link has been sent'
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Verify reset token validity
 */
const verifyToken = async (req, res, next) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json(
                ApiResponse.error('Reset token is required', 400)
            );
        }

        // Hash the provided token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with this token
        const user = await User.findOne({
            where: {
                resetToken: hashedToken
            }
        });

        if (!user || !user.resetTokenExpiry) {
            return res.status(400).json(
                ApiResponse.error('Invalid or expired reset token', 400)
            );
        }

        // Check if token has expired
        if (user.resetTokenExpiry < new Date()) {
            return res.status(400).json(
                ApiResponse.error('Reset token has expired', 400)
            );
        }

        res.json(
            ApiResponse.success({ valid: true }, 'Token is valid')
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password using valid token
 */
const resetPassword = async (req, res, next) => {
    try {
        // Validate input
        const { error, value } = resetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json(
                ApiResponse.error(error.details[0].message, 400)
            );
        }

        const { token, newPassword } = value;

        // Hash the provided token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with this token
        const user = await User.findOne({
            where: {
                resetToken: hashedToken
            }
        });

        if (!user || !user.resetTokenExpiry) {
            return res.status(400).json(
                ApiResponse.error('Invalid or expired reset token', 400)
            );
        }

        // Check if token has expired
        if (user.resetTokenExpiry < new Date()) {
            // Clear expired token
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();

            return res.status(400).json(
                ApiResponse.error('Reset token has expired', 400)
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);

        // Clear reset token
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();

        res.json(
            ApiResponse.success(null, 'Password has been reset successfully')
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requestReset,
    verifyToken,
    resetPassword
};
