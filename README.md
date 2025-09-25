# Calog - React Native App with Google OAuth

Complete React Native + Node.js/Express + MongoDB system with Google OAuth integration.

## 🚀 Features

- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React Native with TypeScript
- **Authentication**: Google OAuth + JWT
- **Database**: MongoDB with Mongoose
- **Security**: Secure token storage, JWT refresh, rate limiting
- **Port**: Backend runs on port 4000

## 📋 System Requirements

- Node.js >= 20
- MongoDB
- React Native development environment
- Google Cloud Console account

## 🛠️ Installation

### 1. Clone and install dependencies

```bash
# Clone repository
git clone <your-repo-url>
cd calog

# Install dependencies for React Native app
npm install

# Install dependencies for backend
cd server
npm install
cd ..
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
      - Application type: Web application
      - Authorized redirect URIs: `http://localhost:4000/auth/google/callback`
5. Save Client ID and Client Secret

### 3. Configure MongoDB

```bash
# Start MongoDB (if using local)
mongod

# Or use MongoDB Atlas (cloud)
# Create cluster and get connection string
```

### 4. Configure Environment Variables

Create `.env` file in `server` directory:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/calog
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/calog

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-it-long-and-random
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback

# React Native App Configuration
REACT_NATIVE_REDIRECT_URL=calog://auth/callback
```

### 5. Configure React Native OAuth

Update `src/services/googleOAuth.ts`:

```typescript
const googleConfig = {
        issuer: 'https://accounts.google.com',
        clientId: 'YOUR_GOOGLE_CLIENT_ID_HERE', // Replace with actual Client ID
        redirectUrl: 'calog://auth/callback',
        scopes: ['openid', 'profile', 'email'],
        // ... rest of config
};
```

### 6. Configure Deep Linking (Android)

Update `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="calog" />
    </intent-filter>
</activity>
```

### 7. Configure Deep Linking (iOS)

Update `ios/calog/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>calog</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>calog</string>
        </array>
    </dict>
</array>
```

## 🚀 Running the Application

### 1. Start Backend

```bash
cd server
npm run dev
```

Backend will run on `http://localhost:4000`

### 2. Start React Native App

```bash
# Android
npm run android

# iOS
npm run ios

# Or run Metro bundler only
npm start
```

### 3. Run Both Together

```bash
# Android + Backend
npm run dev

# iOS + Backend
npm run dev:ios
```

## 📱 Usage

1. Open React Native app
2. Tap "Login with Google"
3. Select Google account
4. App will automatically login and save user info
5. Use `/auth/me` endpoint to get user information

## 🔧 API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Handle Google OAuth callback
- `GET /auth/me` - Get current user info (requires JWT)
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout

### Health Check

- `GET /health` - Check server status

## 🗄️ Database Schema

### User Model

```javascript
{
    googleId: String,        // Google OAuth ID
    email: String,           // Email (required)
    name: String,            // Google display name
    avatar: String,          // Google profile picture
    refreshToken: String,    // Google refresh token
    role: String,            // 'free', 'premium', 'admin'
    createdAt: Date,
    updatedAt: Date
}
```

## 🔒 Security Features

- JWT access tokens (15 minutes)
- JWT refresh tokens (7 days)
- Secure token storage with Keychain/Keystore
- Rate limiting (100 requests/15 minutes)
- CORS protection
- Helmet security headers
- Password hashing with bcrypt
- Token rotation

## 🐛 Troubleshooting

### Google OAuth Errors

1. Check Client ID and Client Secret
2. Ensure redirect URI is correct
3. Check Google Cloud Console settings

### MongoDB Errors

1. Ensure MongoDB is running
2. Check connection string
3. Check network connectivity

### Deep Linking Errors

1. Check scheme configuration
2. Test with `adb` commands (Android)
3. Check Info.plist (iOS)

## 📝 Development Notes

- Backend uses Express with security middleware
- Frontend uses Zustand for state management
- React Query for API calls and caching
- TypeScript for type safety
- NativeWind for styling

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.
