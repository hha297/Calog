const { User, UserRole } = require('../models/User');
const MeasurementLog = require('../models/MeasurementLog');
const { JWTUtils, ResponseUtils, ErrorUtils } = require('../utils');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
        // POST /auth/signup
        static signup = ErrorUtils.asyncHandler(async (req, res) => {
                const { fullName, email, password } = req.body;

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                        return ResponseUtils.error(
                                res,
                                'This email is already registered. Please sign in or use a different email.',
                                409,
                        );
                }

                const user = new User({
                        fullName,
                        email,
                        passwordHash: password,
                        role: UserRole.FREE,
                });

                await user.save();

                const { accessToken, refreshToken } = JWTUtils.generateTokens(user._id);
                const refreshTokenExpiry = JWTUtils.getRefreshTokenExpiry();

                await user.addRefreshToken(refreshToken, refreshTokenExpiry);

                ResponseUtils.success(
                        res,
                        { user: user.toJSON(), accessToken, refreshToken },
                        'User created successfully',
                        201,
                );
        });

        // POST /auth/login
        static login = ErrorUtils.asyncHandler(async (req, res) => {
                const { email, password, rememberMe } = req.body;

                const user = await User.findOne({ email });
                if (!user) {
                        return ResponseUtils.error(
                                res,
                                'Account not found. Please check your email or sign up for a new account.',
                                401,
                        );
                }

                const isPasswordValid = await user.comparePassword(password);
                if (!isPasswordValid) {
                        return ResponseUtils.error(res, 'Incorrect password. Please try again.', 401);
                }

                await user.removeExpiredRefreshTokens();

                let accessToken, refreshToken;

                if (user.refreshTokens.length > 0) {
                        // Already has valid refresh token -> keep existing refresh token
                        refreshToken = user.refreshTokens[0].token;
                        accessToken = JWTUtils.generateAccessToken(user._id);
                } else {
                        // No refresh token -> create new one
                        const tokens = JWTUtils.generateTokens(user._id);
                        accessToken = tokens.accessToken;
                        refreshToken = tokens.refreshToken;

                        const refreshTokenExpiry = rememberMe
                                ? JWTUtils.getRefreshTokenExpiry()
                                : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

                        await user.addRefreshToken(refreshToken, refreshTokenExpiry);
                }

                ResponseUtils.success(res, { user: user.toJSON(), accessToken, refreshToken }, 'Login successful');
        });

        // POST /auth/refresh
        static refreshToken = ErrorUtils.asyncHandler(async (req, res) => {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                        return ResponseUtils.error(res, 'Refresh token is required', 401);
                }

                const decoded = JWTUtils.verifyRefreshToken(refreshToken);

                const user = await User.findById(decoded.userId);
                if (!user) {
                        return ResponseUtils.error(res, 'User not found', 401);
                }

                await user.removeExpiredRefreshTokens();

                const tokenExists = user.refreshTokens.some((rt) => rt.token === refreshToken);
                if (!tokenExists) {
                        return ResponseUtils.error(res, 'Invalid refresh token', 401);
                }

                // ✅ Non-rolling: only issue new access token
                const accessToken = JWTUtils.generateAccessToken(user._id);

                ResponseUtils.success(res, { accessToken, refreshToken }, 'Access token refreshed successfully');
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

        // GET /auth/me
        static getCurrentUser = ErrorUtils.asyncHandler(async (req, res) => {
                const userId = req.user.userId;
                const user = await User.findById(userId);
                if (!user) {
                        return ResponseUtils.error(res, 'User not found', 404);
                }

                ResponseUtils.success(res, { user: user.toJSON() }, 'User retrieved successfully');
        });

        // GET /auth/google
        static googleAuth = ErrorUtils.asyncHandler(async (req, res) => {
                const authUrl = googleClient.generateAuthUrl({
                        access_type: 'offline',
                        scope: ['profile', 'email'],
                        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                });

                res.redirect(authUrl);
        });

        // POST /auth/google
        static googleSignIn = ErrorUtils.asyncHandler(async (req, res) => {
                const { idToken, accessToken, user: googleUser } = req.body;

                if (!idToken || !googleUser) {
                        return ResponseUtils.error(res, 'Missing Google authentication data', 400);
                }

                try {
                        const ticket = await googleClient.verifyIdToken({
                                idToken,
                                audience: process.env.GOOGLE_CLIENT_ID,
                        });

                        const payload = ticket.getPayload();
                        const { sub: googleId, email, name, picture: avatar } = payload;

                        if (email !== googleUser.email) {
                                return ResponseUtils.error(res, 'Email mismatch in Google authentication', 400);
                        }

                        let user = await User.findOne({ googleId });
                        if (!user) {
                                user = await User.findOne({ email });
                                if (user) {
                                        user.googleId = googleId;
                                        user.name = name || googleUser.name;
                                        user.avatar = avatar || googleUser.avatar;
                                } else {
                                        user = new User({
                                                googleId,
                                                email,
                                                name: name || googleUser.name,
                                                avatar: avatar || googleUser.avatar,
                                                role: UserRole.FREE,
                                        });
                                }
                        } else {
                                user.name = name || googleUser.name;
                                user.avatar = avatar || googleUser.avatar;
                        }

                        await user.save();

                        await user.removeExpiredRefreshTokens();

                        let accessTokenJwt, refreshToken;
                        if (user.refreshTokens.length > 0) {
                                refreshToken = user.refreshTokens[0].token;
                                accessTokenJwt = JWTUtils.generateAccessToken(user._id);
                        } else {
                                const tokens = JWTUtils.generateTokens(user._id);
                                accessTokenJwt = tokens.accessToken;
                                refreshToken = tokens.refreshToken;

                                const refreshTokenExpiry = JWTUtils.getRefreshTokenExpiry();
                                await user.addRefreshToken(refreshToken, refreshTokenExpiry);
                        }

                        ResponseUtils.success(
                                res,
                                { user: user.toJSON(), accessToken: accessTokenJwt, refreshToken },
                                'Google authentication successful',
                        );
                } catch (error) {
                        return ResponseUtils.error(res, 'Google authentication failed', 500);
                }
        });

        // GET /auth/google/callback
        static googleCallback = ErrorUtils.asyncHandler(async (req, res) => {
                const { code } = req.query;
                if (!code) {
                        return ResponseUtils.error(res, 'Authorization code not provided', 400);
                }

                try {
                        const { tokens } = await googleClient.getToken({
                                code,
                                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                        });

                        googleClient.setCredentials(tokens);

                        const ticket = await googleClient.verifyIdToken({
                                idToken: tokens.id_token,
                                audience: process.env.GOOGLE_CLIENT_ID,
                        });

                        const payload = ticket.getPayload();
                        const { sub: googleId, email, name, picture: avatar } = payload;

                        let user = await User.findOne({ googleId });
                        if (!user) {
                                user = await User.findOne({ email });
                                if (user) {
                                        user.googleId = googleId;
                                        user.name = name;
                                        user.avatar = avatar;
                                } else {
                                        user = new User({
                                                googleId,
                                                email,
                                                name,
                                                avatar,
                                                role: UserRole.FREE,
                                        });
                                }
                        } else {
                                user.name = name;
                                user.avatar = avatar;
                        }

                        await user.save();

                        const { accessToken, refreshToken } = JWTUtils.generateTokens(user._id);
                        const refreshTokenExpiry = JWTUtils.getRefreshTokenExpiry();
                        await user.addRefreshToken(refreshToken, refreshTokenExpiry);

                        const redirectUrl = `${process.env.REACT_NATIVE_REDIRECT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`;
                        res.redirect(redirectUrl);
                } catch (error) {
                        return ResponseUtils.error(res, 'Google authentication failed', 500);
                }
        });

        // Delete user account and all related data
        static async deleteAccount(req, res) {
                try {
                        const userId = req.user.userId;

                        // Start a transaction to ensure data consistency
                        const session = await User.startSession();
                        session.startTransaction();

                        try {
                                // 1. Delete all measurement logs for this user
                                const deletedLogs = await MeasurementLog.deleteMany({ userId }).session(session);

                                // 2. Delete the user
                                const deletedUser = await User.findByIdAndDelete(userId).session(session);
                                if (!deletedUser) {
                                        await session.abortTransaction();
                                        return ResponseUtils.notFound(res, 'User not found');
                                }

                                // 3. Commit the transaction
                                await session.commitTransaction();

                                return ResponseUtils.success(
                                        res,
                                        {
                                                message: 'Account and all related data deleted successfully',
                                                deletedLogs: deletedLogs.deletedCount,
                                        },
                                        'Account deleted successfully',
                                );
                        } catch (error) {
                                // Rollback transaction on error
                                await session.abortTransaction();
                                throw error;
                        } finally {
                                session.endSession();
                        }
                } catch (error) {
                        console.error('AuthController.deleteAccount - Error:', error);
                        return ResponseUtils.serverError(res, 'Failed to delete account');
                }
        }
}

module.exports = AuthController;
