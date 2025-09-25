const { User, UserRole } = require('../models/User');
const { JWTUtils, ResponseUtils, ErrorUtils } = require('../utils');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

        // GET /auth/google - Initiate Google OAuth flow
        static googleAuth = ErrorUtils.asyncHandler(async (req, res) => {
                const authUrl = googleClient.generateAuthUrl({
                        access_type: 'offline',
                        scope: ['profile', 'email'],
                        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                });

                res.redirect(authUrl);
        });

        // POST /auth/google - Handle Google Sign-In from mobile app
        static googleSignIn = ErrorUtils.asyncHandler(async (req, res) => {
                const { idToken, accessToken, user: googleUser } = req.body;

                if (!idToken || !googleUser) {
                        return ResponseUtils.error(res, 'Missing required Google authentication data', 400);
                }

                try {
                        // Verify the ID token
                        const ticket = await googleClient.verifyIdToken({
                                idToken,
                                audience: process.env.GOOGLE_CLIENT_ID,
                        });

                        const payload = ticket.getPayload();
                        const { sub: googleId, email, name, picture: avatar } = payload;

                        // Validate that the email matches
                        if (email !== googleUser.email) {
                                return ResponseUtils.error(res, 'Email mismatch in Google authentication', 400);
                        }

                        // Check if user already exists
                        let user = await User.findOne({ googleId });

                        if (!user) {
                                // Check if user exists with same email
                                user = await User.findOne({ email });

                                if (user) {
                                        // Link Google account to existing user
                                        user.googleId = googleId;
                                        user.name = name || googleUser.name;
                                        user.avatar = avatar || googleUser.avatar;
                                } else {
                                        // Create new user
                                        user = new User({
                                                googleId,
                                                email,
                                                name: name || googleUser.name,
                                                avatar: avatar || googleUser.avatar,
                                                role: UserRole.FREE,
                                        });
                                }
                        } else {
                                // Update existing Google user
                                user.name = name || googleUser.name;
                                user.avatar = avatar || googleUser.avatar;
                        }

                        await user.save();

                        // Generate JWT tokens
                        const { accessToken: jwtAccessToken, refreshToken } = JWTUtils.generateTokens(user._id);
                        const refreshTokenExpiry = JWTUtils.getRefreshTokenExpiry();

                        // Save refresh token
                        await user.addRefreshToken(refreshToken, refreshTokenExpiry);

                        ResponseUtils.success(
                                res,
                                {
                                        user: user.toJSON(),
                                        accessToken: jwtAccessToken,
                                        refreshToken,
                                },
                                'Google authentication successful',
                        );
                } catch (error) {
                        console.error('Google Sign-In error:', error);
                        return ResponseUtils.error(res, 'Google authentication failed', 500);
                }
        });

        // GET /auth/google/callback - Handle Google OAuth callback (for web)
        static googleCallback = ErrorUtils.asyncHandler(async (req, res) => {
                const { code } = req.query;

                if (!code) {
                        return ResponseUtils.error(res, 'Authorization code not provided', 400);
                }

                try {
                        // Exchange code for tokens
                        const { tokens } = await googleClient.getToken({
                                code,
                                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                        });

                        googleClient.setCredentials(tokens);

                        // Get user info from Google
                        const ticket = await googleClient.verifyIdToken({
                                idToken: tokens.id_token,
                                audience: process.env.GOOGLE_CLIENT_ID,
                        });

                        const payload = ticket.getPayload();
                        const { sub: googleId, email, name, picture: avatar } = payload;

                        // Check if user already exists
                        let user = await User.findOne({ googleId });

                        if (!user) {
                                // Check if user exists with same email
                                user = await User.findOne({ email });

                                if (user) {
                                        // Link Google account to existing user
                                        user.googleId = googleId;
                                        user.name = name;
                                        user.avatar = avatar;
                                        user.refreshToken = tokens.refresh_token;
                                } else {
                                        // Create new user
                                        user = new User({
                                                googleId,
                                                email,
                                                name,
                                                avatar,
                                                refreshToken: tokens.refresh_token,
                                                role: UserRole.FREE,
                                        });
                                }
                        } else {
                                // Update existing Google user
                                user.name = name;
                                user.avatar = avatar;
                                user.refreshToken = tokens.refresh_token;
                        }

                        await user.save();

                        // Generate JWT tokens
                        const { accessToken, refreshToken } = JWTUtils.generateTokens(user._id);
                        const refreshTokenExpiry = JWTUtils.getRefreshTokenExpiry();

                        // Save refresh token
                        await user.addRefreshToken(refreshToken, refreshTokenExpiry);

                        // Redirect to React Native app with tokens
                        const redirectUrl = `${process.env.REACT_NATIVE_REDIRECT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`;
                        res.redirect(redirectUrl);
                } catch (error) {
                        console.error('Google OAuth error:', error);
                        return ResponseUtils.error(res, 'Google authentication failed', 500);
                }
        });
}

module.exports = AuthController;
