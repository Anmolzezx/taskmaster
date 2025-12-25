const { verifyAccessToken } = require('../config/jwt');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(
                ApiResponse.unauthorized('No token provided')
            );
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        return res.status(401).json(
            ApiResponse.unauthorized('Invalid or expired token')
        );
    }
};

module.exports = { authenticate };
