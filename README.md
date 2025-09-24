# Calog - Complete Authentication System

A full-stack authentication system for React Native with Express.js backend, MongoDB, JWT tokens, and secure storage.

## 🚀 Features

### Backend (Express.js + MongoDB)

- ✅ User registration and login
- ✅ JWT access tokens (30 minutes expiry)
- ✅ JWT refresh tokens (7 days expiry, rolling)
- ✅ Password hashing with bcrypt
- ✅ User roles (free, premium, admin)
- ✅ Authentication middleware for protected routes
- ✅ Rate limiting and security headers
- ✅ Input validation with express-validator

### Frontend (React Native + TypeScript)

- ✅ Sign up and sign in screens with validation
- ✅ Remember me functionality
- ✅ Secure token storage with react-native-keychain
- ✅ Auto-refresh token on app start
- ✅ Zustand state management
- ✅ React Query for API calls and caching
- ✅ Authentication flow with React Navigation
- ✅ Logout functionality

## 📋 Prerequisites

- Node.js >= 20
- MongoDB Atlas account (or local MongoDB)
- React Native development environment
- iOS Simulator or Android Emulator

## 🛠️ Setup Instructions

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your MongoDB URI and JWT secrets
# Copy the content below to server/.env file

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# For iOS
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/calog?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES=30m
JWT_REFRESH_EXPIRES=7d
NODE_ENV=development
```

## 🔧 API Endpoints

### Authentication Routes

| Method | Endpoint        | Description          | Body                                     |
| ------ | --------------- | -------------------- | ---------------------------------------- |
| POST   | `/auth/signup`  | Register new user    | `{ fullName, email, password }`          |
| POST   | `/auth/login`   | Login user           | `{ email, password, rememberMe? }`       |
| POST   | `/auth/refresh` | Refresh access token | `{ refreshToken }`                       |
| POST   | `/auth/logout`  | Logout user          | `{ refreshToken? }`                      |
| GET    | `/auth/me`      | Get current user     | Headers: `Authorization: Bearer <token>` |

## 🔐 Security Features

### Token Management

- **Access Token**: 30 minutes expiry, stored in memory
- **Refresh Token**: 7 days expiry, stored securely in Keychain
- **Rolling Refresh**: New refresh token issued on each refresh
- **Token Rotation**: Old refresh tokens are invalidated

### Password Security

- Bcrypt hashing with salt rounds of 12
- Minimum 6 character password requirement
- Password confirmation validation on frontend only

### Storage Security

- Refresh tokens stored in iOS Keychain / Android Keystore
- Access tokens stored in memory only
- Automatic cleanup on logout

## 📱 User Experience

### Authentication Flow

1. **App Start**: Check for stored refresh token
2. **Auto-Login**: If valid refresh token exists, auto-login user
3. **Manual Login**: User can sign in with email/password
4. **Remember Me**: Optional persistent login for 7 days
5. **Auto-Refresh**: Tokens refreshed automatically in background
6. **Logout**: Clear all tokens and return to login screen

### Remember Me Behavior

- **Checked**: Refresh token stored securely, auto-login on app restart
- **Unchecked**: Session-based login, expires when app closes

## 🏗️ Architecture

### Backend Structure

```
server/
├── index.js              # Express server setup
├── models/
│   └── User.js          # User schema with roles
├── routes/
│   └── auth.js           # Authentication routes
├── middleware/
│   └── auth.js           # JWT authentication middleware
└── package.json
```

### Frontend Structure

```
src/
├── components/ui/        # Reusable UI components
├── hooks/
│   └── useAuth.ts       # React Query auth hooks
├── navigation/          # Navigation setup
├── screens/auth/        # Authentication screens
├── services/
│   ├── api/            # API client and endpoints
│   └── secureStorage.ts # Keychain storage service
├── store/
│   └── index.ts        # Zustand auth store
└── types/
    └── index.ts        # TypeScript definitions
```

## 🚀 Deployment

### Backend Deployment

1. Deploy to Heroku, Vercel, or your preferred platform
2. Set environment variables in production
3. Update MongoDB connection string
4. Configure CORS for production domain

### Frontend Deployment

1. Build for production
2. Deploy to App Store / Google Play Store
3. Update API base URL for production

## 📝 Notes

- The authentication system is production-ready
- All sensitive data is properly secured
- Error handling is comprehensive
- The UI is responsive and accessible
- TypeScript provides type safety throughout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
