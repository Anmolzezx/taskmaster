/**
 * Standard API response format
 */
class ApiResponse {
    static success(data, message = 'Success', statusCode = 200) {
        return {
            success: true,
            message,
            data,
            statusCode
        };
    }

    static error(message = 'Error occurred', statusCode = 500, errors = null) {
        return {
            success: false,
            message,
            errors,
            statusCode
        };
    }

    static validationError(errors) {
        return {
            success: false,
            message: 'Validation failed',
            errors,
            statusCode: 400
        };
    }

    static notFound(message = 'Resource not found') {
        return {
            success: false,
            message,
            statusCode: 404
        };
    }

    static unauthorized(message = 'Unauthorized access') {
        return {
            success: false,
            message,
            statusCode: 401
        };
    }
}

module.exports = ApiResponse;
