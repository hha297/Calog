const { User, UserRole } = require('../models/User');
const { JWTUtils, ResponseUtils, ErrorUtils } = require('../utils');

// Auth Controller
class AuthController {
        // POST /auth/signup
        static signup = ErrorUtils.asyncHandler(async (req, res) => {
                const { fullName, email, password } = req.body;

                // Check if user already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                        return ResponseUtils.error(res, 'User with this email already exists', 409);
                }

                // Create new user
                const user = new User({
                        fullName,
                        email,
                        passwordHash: password, // Will be hashed by pre-save middleware
                        role: UserRole.FREE,
                });

                await user.save();

                // Generate tokens
                const { accessToken, refreshToken } = JWTUtils.generateTokens(user._id);
                const refreshTokenExpiry = JWTUtils.getRefreshTokenExpiry();

                // Save refresh token
                await user.addRefreshToken(refreshToken, refreshTokenExpiry);

                ResponseUtils.success(
                        res,
                        {
                                user: user.toJSON(),
                                accessToken,
                                refreshToken,
                        },
                        'User created successfully',
                        201,
                );
        });

        // POST /auth/login
        static login = ErrorUtils.asyncHandler(async (req, res) => {
                const { email, password, rememberMe } = req.body;

                // Find user
                const user = await User.findOne({ email });
                if (!user) {
                        return ResponseUtils.error(res, 'Invalid email or password', 401);
                }

                // Check password
                const isPasswordValid = await user.comparePassword(password);
                if (!isPasswordValid) {
                        return ResponseUtils.error(res, 'Invalid email or password', 401);
                }

                // Remove expired refresh tokens
                await user.removeExpiredRefreshTokens();

                // Generate tokens
                const { accessToken, refreshToken } = JWTUtils.generateTokens(user._id);
                const refreshTokenExpiry = JWTUtils.getRefreshTokenExpiry();

                // Save refresh token (only if rememberMe is true)
                if (rememberMe) {
                        await user.addRefreshToken(refreshToken, refreshTokenExpiry);
                }

                ResponseUtils.success(
                        res,
                        {
                                user: user.toJSON(),
                                accessToken,
                                refreshToken: rememberMe ? refreshToken : undefined,
                        },
                        'Login successful',
                );
        });

        // POST /auth/refresh
        static refreshToken = ErrorUtils.asyncHandler(async (req, res) => {
                const { refreshToken } = req.body;

                if (!refreshToken) {
                        return ResponseUtils.error(res, 'Refresh token is required', 401);
                }

                // Verify refresh token
                const decoded = JWTUtils.verifyRefreshToken(refreshToken);

                // Find user and check if refresh token exists
                const user = await User.findById(decoded.userId);
                if (!user) {
                        return ResponseUtils.error(res, 'User not found', 401);
                }

                const tokenExists = user.refreshTokens.some((rt) => rt.token === refreshToken);
                if (!tokenExists) {
                        return ResponseUtils.error(res, 'Invalid refresh token', 401);
                }

                // Remove expired refresh tokens
                await user.removeExpiredRefreshTokens();

                // Generate new tokens
                const { accessToken, refreshToken: newRefreshToken } = JWTUtils.generateTokens(user._id);
                const refreshTokenExpiry = JWTUtils.getRefreshTokenExpiry();

                // Remove old refresh token and add new one (rolling refresh)
                await user.removeRefreshToken(refreshToken);
                await user.addRefreshToken(newRefreshToken, refreshTokenExpiry);

                ResponseUtils.success(
                        res,
                        {
                                accessToken,
                                refreshToken: newRefreshToken,
                        },
                        'Tokens refreshed successfully',
                );
        });

        // POST /auth/logout
        static logout = ErrorUtils.asyncHandler(async (req, res) => {
                const { refreshToken } = req.body;
                const userId = req.user.userId;

                const user = await User.findById(userId);
                if (user && refreshToken) {
                        await user.removeRefreshToken(refreshToken);
                }

                ResponseUtils.success(res, null, 'Logout successful');
        });

        // GET /auth/me - Get current user info
        static getCurrentUser = ErrorUtils.asyncHandler(async (req, res) => {
                const userId = req.user.userId;
                const user = await User.findById(userId);

                if (!user) {
                        return ResponseUtils.error(res, 'User not found', 404);
                }

                ResponseUtils.success(
                        res,
                        {
                                user: user.toJSON(),
                        },
                        'User retrieved successfully',
                );
        });
}

module.exports = AuthController;
