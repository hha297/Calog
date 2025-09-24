const jwt = require('jsonwebtoken');

// JWT Utilities
class JWTUtils {
        // Generate access and refresh tokens
        static generateTokens(userId) {
                const accessToken = jwt.sign({ userId, type: 'access' }, process.env.JWT_ACCESS_SECRET, {
                        expiresIn: process.env.JWT_ACCESS_EXPIRES,
                });

                const refreshToken = jwt.sign({ userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
                        expiresIn: process.env.JWT_REFRESH_EXPIRES,
                });

                return { accessToken, refreshToken };
        }

        // Calculate refresh token expiry date
        static getRefreshTokenExpiry() {
                const expiresIn = process.env.JWT_REFRESH_EXPIRES;
                const now = new Date();

                if (expiresIn.endsWith('d')) {
                        const days = parseInt(expiresIn);
                        return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                } else if (expiresIn.endsWith('h')) {
                        const hours = parseInt(expiresIn);
                        return new Date(now.getTime() + hours * 60 * 60 * 1000);
                } else if (expiresIn.endsWith('m')) {
                        const minutes = parseInt(expiresIn);
                        return new Date(now.getTime() + minutes * 60 * 1000);
                }

                // Default to 7 days
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        // Verify refresh token
        static verifyRefreshToken(token) {
                try {
                        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

                        if (decoded.type !== 'refresh') {
                                throw new Error('Invalid token type');
                        }

                        return decoded;
                } catch (error) {
                        throw error;
                }
        }
}

// Response Utilities
class ResponseUtils {
        // Send success response
        static success(res, data, message = 'Success', statusCode = 200) {
                return res.status(statusCode).json({
                        success: true,
                        message,
                        data,
                });
        }

        // Send error response
        static error(res, message = 'Internal server error', statusCode = 500, errors = null) {
                const response = {
                        success: false,
                        message,
                };

                if (errors) {
                        response.errors = errors;
                }

                return res.status(statusCode).json(response);
        }

        // Send validation error response
        static validationError(res, errors) {
                return res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors,
                });
        }
}

// Error Utilities
class ErrorUtils {
        // Handle async errors
        static asyncHandler(fn) {
                return (req, res, next) => {
                        Promise.resolve(fn(req, res, next)).catch(next);
                };
        }

        // Global error handler
        static globalErrorHandler(err, req, res, next) {
                console.error('Global error:', err);

                // JWT errors
                if (err.name === 'JsonWebTokenError') {
                        return ResponseUtils.error(res, 'Invalid token', 401);
                }

                if (err.name === 'TokenExpiredError') {
                        return ResponseUtils.error(res, 'Token expired', 401);
                }

                // Mongoose validation errors
                if (err.name === 'ValidationError') {
                        const errors = Object.values(err.errors).map((e) => ({
                                field: e.path,
                                message: e.message,
                        }));
                        return ResponseUtils.validationError(res, errors);
                }

                // Mongoose duplicate key error
                if (err.code === 11000) {
                        const field = Object.keys(err.keyValue)[0];
                        return ResponseUtils.error(res, `${field} already exists`, 409);
                }

                // Default error
                return ResponseUtils.error(res, 'Internal server error', 500);
        }
}

module.exports = {
        JWTUtils,
        ResponseUtils,
        ErrorUtils,
};
