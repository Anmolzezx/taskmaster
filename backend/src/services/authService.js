const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');

/**
 * Register a new user
 */
const register = async (email, password, fullName) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            passwordHash,
            fullName
        });

        // Generate tokens
        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl
            },
            accessToken,
            refreshToken
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Login user
 */
const login = async (email, password) => {
    try {
        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate tokens
        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl
            },
            accessToken,
            refreshToken
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refreshToken) => {
    try {
        const { verifyRefreshToken } = require('../config/jwt');
        const decoded = verifyRefreshToken(refreshToken);

        // Generate new access token
        const payload = { userId: decoded.userId, email: decoded.email };
        const newAccessToken = generateAccessToken(payload);

        return { accessToken: newAccessToken };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken
};
