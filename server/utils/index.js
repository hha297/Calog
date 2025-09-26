const jwt = require('jsonwebtoken');

// ======================= JWT Utilities =======================
class JWTUtils {
        // Generate only access token
        static generateAccessToken(userId) {
                return jwt.sign({ userId, type: 'access' }, process.env.JWT_ACCESS_SECRET, {
                        expiresIn: process.env.JWT_ACCESS_EXPIRES,
                });
        }

        // Generate only refresh token
        static generateRefreshToken(userId) {
                return jwt.sign({ userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
                        expiresIn: process.env.JWT_REFRESH_EXPIRES,
                });
        }

        // Generate both tokens (login/signup)
        static generateTokens(userId) {
                const accessToken = this.generateAccessToken(userId);
                const refreshToken = this.generateRefreshToken(userId);
                return { accessToken, refreshToken };
        }

        // Calculate refresh token expiry date (for saving in DB)
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

                // Default 7 days
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        // Verify refresh token
        static verifyRefreshToken(token) {
                const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
                if (decoded.type !== 'refresh') {
                        throw new Error('Invalid token type');
                }
                return decoded;
        }
}

// ======================= Response Utilities =======================
class ResponseUtils {
        static success(res, data, message = 'Success', statusCode = 200) {
                return res.status(statusCode).json({
                        success: true,
                        message,
                        data,
                });
        }

        static error(res, message = 'Internal server error', statusCode = 500, errors = null) {
                const response = { success: false, message };
                if (errors) response.errors = errors;
                return res.status(statusCode).json(response);
        }

        static validationError(res, errors) {
                return res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors,
                });
        }

        static serverError(res, message = 'Internal server error', statusCode = 500) {
                return res.status(statusCode).json({
                        success: false,
                        message,
                });
        }

        static notFound(res, message = 'Resource not found') {
                return res.status(404).json({
                        success: false,
                        message,
                });
        }
}

// ======================= Error Utilities =======================
class ErrorUtils {
        static asyncHandler(fn) {
                return (req, res, next) => {
                        Promise.resolve(fn(req, res, next)).catch(next);
                };
        }

        static globalErrorHandler(err, req, res, next) {
                console.error('Global error:', err);

                if (err.name === 'JsonWebTokenError') {
                        return ResponseUtils.error(res, 'Invalid token', 401);
                }
                if (err.name === 'TokenExpiredError') {
                        return ResponseUtils.error(res, 'Token expired', 401);
                }
                if (err.name === 'ValidationError') {
                        const errors = Object.values(err.errors).map((e) => ({
                                field: e.path,
                                message: e.message,
                        }));
                        return ResponseUtils.validationError(res, errors);
                }
                if (err.code === 11000) {
                        const field = Object.keys(err.keyValue)[0];
                        return ResponseUtils.error(res, `${field} already exists`, 409);
                }

                return ResponseUtils.error(res, 'Internal server error', 500);
        }
}

module.exports = {
        JWTUtils,
        ResponseUtils,
        ErrorUtils,
};
