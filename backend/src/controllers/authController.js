const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Email and password are required' })
            );
        }

        if (password.length < 6) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Password must be at least 6 characters' })
            );
        }

        const result = await authService.register(email, password, fullName);

        res.status(201).json(
            ApiResponse.success(result, 'User registered successfully', 201)
        );
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(409).json(
                ApiResponse.error(error.message, 409)
            );
        }
        res.status(500).json(
            ApiResponse.error('Registration failed: ' + error.message, 500)
        );
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Email and password are required' })
            );
        }

        const result = await authService.login(email, password);

        res.status(200).json(
            ApiResponse.success(result, 'Login successful')
        );
    } catch (error) {
        if (error.message.includes('Invalid')) {
            return res.status(401).json(
                ApiResponse.unauthorized(error.message)
            );
        }
        res.status(500).json(
            ApiResponse.error('Login failed: ' + error.message, 500)
        );
    }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(
                ApiResponse.validationError({ message: 'Refresh token is required' })
            );
        }

        const result = await authService.refreshAccessToken(refreshToken);

        res.status(200).json(
            ApiResponse.success(result, 'Token refreshed successfully')
        );
    } catch (error) {
        res.status(401).json(
            ApiResponse.unauthorized('Invalid refresh token')
        );
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
    try {
        // In a production app, you might want to blacklist the token
        // For now, we'll just return success
        res.status(200).json(
            ApiResponse.success(null, 'Logout successful')
        );
    } catch (error) {
        res.status(500).json(
            ApiResponse.error('Logout failed', 500)
        );
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout
};
