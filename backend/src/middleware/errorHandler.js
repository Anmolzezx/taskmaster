const ApiResponse = require('../utils/ApiResponse');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json(
            ApiResponse.validationError(err.errors.map(e => e.message))
        );
    }

    // Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json(
            ApiResponse.error('Resource already exists', 409)
        );
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(
            ApiResponse.unauthorized('Invalid token')
        );
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json(
            ApiResponse.unauthorized('Token expired')
        );
    }

    // Default error
    res.status(err.statusCode || 500).json(
        ApiResponse.error(
            err.message || 'Internal server error',
            err.statusCode || 500
        )
    );
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    res.status(404).json(
        ApiResponse.notFound(`Route ${req.originalUrl} not found`)
    );
};

module.exports = {
    errorHandler,
    notFoundHandler
};
