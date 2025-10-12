# Calog

Calog is a comprehensive fitness tracking and calorie management platform designed for React Native. Built with modern technologies and secure authentication, it provides users with advanced body composition analysis, multi-language support, and personalized fitness goals.

## 📋 Table of Contents

- [🚀 Introduction](#introduction)
- [⚡ Tech Stack](#tech-stack)
- [✨ Key Features](#key-features)
- [📁 Project Structure](#project-structure)
- [🔧 Environment Variables](#environment-variables)
- [🏃‍♂️ Getting Started](#getting-started)
- [🔗 API Endpoints](#api-endpoints)
- [🔒 Security Features](#security-features)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

## 🚀 Introduction

Calog is a full-stack fitness tracking application that combines React Native with a Node.js backend to deliver a comprehensive health and fitness management experience. The platform features advanced body composition analysis using the U.S. Navy Method, multi-language support with Google Translate integration, and secure authentication with persistent login capabilities.

**Smart Calorie Tracking**: Scan QR codes from food products to instantly log calories and track your daily nutrition intake. Monitor your calorie consumption with real-time tracking and personalized daily calorie goals based on your fitness objectives.

**Daily Calorie Management**: Set personalized daily calorie targets based on your weight goals (lose, maintain, or gain weight) and activity level. Get real-time feedback on your progress and recommendations to stay on track with your fitness journey.

## ⚡ Tech Stack

![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge&logo=zustand&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## ✨ Key Features

### 📱 QR Code & Calorie Tracking

- **QR Code Scanning**: Scan food product barcodes to instantly log calories and nutrition
- **Smart Food Recognition**: AI-powered food identification and calorie calculation
- **Daily Calorie Tracking**: Monitor your calorie intake throughout the day
- **Nutrition Database**: Comprehensive food database with accurate nutritional information
- **Quick Logging**: Fast and easy calorie logging with barcode scanning

### 🔐 Authentication & Security

- **Google OAuth Integration**: Secure sign-in with Google accounts
- **JWT Token Management**: Access tokens (15min) and refresh tokens (7 days)
- **Keychain Storage**: Secure token storage using device keychain
- **Biometric Protection**: Enhanced security with fingerprint/face recognition
- **Persistent Login**: Users stay logged in across app restarts

### 📊 Advanced Body Composition Analysis

- **U.S. Navy Method**: Accurate body fat percentage calculation
- **Body Measurements Tracking**: Neck, waist, hip, bicep, and thigh measurements
- **Fitness Metrics**: BMI, Body Fat Mass, Lean Body Mass, and FFMI calculations
- **Real-time Updates**: Instant recalculation when measurements change

### 🎯 Personalized Fitness Goals

- **Weight Goals**: Lose, gain, or maintain weight with target setting
- **Calorie Calculation**: TDEE calculation using Mifflin-St Jeor equation
- **Activity Level Assessment**: Sedentary to very active lifestyle options
- **Progress Tracking**: Visual analytics and achievement system

### 🌍 Multi-Language Support

- **Static Translations**: Dictionary-based translations for UI elements
- **Dynamic Translation**: Google Translate API integration for dynamic content
- **Supported Languages**: English, Finnish, Vietnamese
- **Language Persistence**: User preference saved across sessions

### 🎨 Modern UI/UX

- **Dark/Light Mode**: Complete theme system with NativeWind v4
- **Theme Persistence**: User preference saved to AsyncStorage
- **Dynamic Components**: Theme-aware styling across all screens
- **Avatar Upload**: Profile picture management with Cloudinary integration

### 📱 Cross-Platform Features

- **Deep Linking**: Custom URL scheme for authentication callbacks
- **Image Picker**: Camera and gallery integration for photos
- **Permission Handling**: Proper camera and photo library permissions
- **BootSplash**: Custom launch screen with logo animation

## 📁 Project Structure

```
calog/
├── src/                                            # React Native source code
│   ├── components/                                 # Reusable UI components
│   │   ├── ui/                                     # Reusabled UI components
│   │   ├── profile/                                # Profile-related components
│   │   └── ...                                     # Other specialized components
│   ├── screens/                                    # Application screens
│   │   ├── auth/                                   # Authentication screens
│   │   ├── onboarding/                             # User onboarding flow
│   │   └── ...                                     # Other screens
│   ├── navigation/                                 # Navigation configuration
│   ├── services/                                   # API and external services
│   ├── hooks/                                      # Custom React hooks
│   ├── contexts/                                   # React contexts (Theme, Language)
│   ├── utils/                                      # Utility functions
│   └── types/                                      # TypeScript type definitions
├── server/                                         # Node.js backend
│   ├── controllers/                                # Route controllers
│   ├── models/                                     # Database models
│   ├── routes/                                     # API routes
│   ├── middleware/                                 # Express middleware
│   └── utils/                                      # Server utilities
├── android/                                        # Android-specific configuration
├── ios/                                            # iOS-specific configuration
└── assets/                                         # Static assets (images, fonts)
```

## 🔧 Environment Variables

Create `.env` file in `server` directory:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/calog

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

# Cloudinary Configuration (for avatar uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 🏃‍♂️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hha297/Calog.git
cd calog
```

### 2. Install dependencies

```bash
# Install React Native dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
      - Application type: Web application
      - Authorized redirect URIs: `http://localhost:4000/auth/google/callback`
5. Save Client ID and Client Secret

### 4. Configure MongoDB

**Option 1: MongoDB Atlas (Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and new cluster
3. Get your connection string and add to `.env` file

**Option 2: Local MongoDB**

```bash
# Install MongoDB locally (if not installed)
# Windows: Download from MongoDB website
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb

# Start MongoDB service
# Windows: Run MongoDB as service or use MongoDB Compass
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongod
```

### 5. Configure Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/users/register/free)
2. Get your Cloud Name, API Key, and API Secret from the Dashboard
3. Add them to your server `.env` file

### 6. Update React Native OAuth Configuration

Update `src/services/googleSigninService.ts`:

```typescript
const googleConfig = {
        issuer: 'https://accounts.google.com',
        clientId: 'YOUR_GOOGLE_CLIENT_ID_HERE', // Replace with actual Client ID
        redirectUrl: 'calog://auth/callback',
        scopes: ['openid', 'profile', 'email'],
        // ... rest of config
};
```

### 7. Configure Deep Linking

#### Android

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

#### iOS

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

### 8. Run the application

```bash
# Start backend
cd server
npm run dev

# In another terminal, start React Native
npm run android  # For Android
npm run ios      # For iOS

# Or run both together
npm run dev      # Android + Backend
npm run dev:ios  # iOS + Backend
```

## 🔗 API Endpoints

### Authentication

- `GET  /auth/google` - Initiate Google OAuth flow

- `GET  /auth/google/callback` - Handle Google OAuth callback

- `GET  /auth/me` - Get current user info
  - **Headers**: `Authorization: Bearer <token>`

- `POST /auth/refresh` - Refresh JWT token
  - **Body**: `{ refreshToken }`

- `POST /auth/logout` - Logout
  - **Headers**: `Authorization: Bearer <token>`

### Profile

- `GET /api/profile` - Get user profile
  - **Headers**: `Authorization: Bearer <token>`

- `PUT /api/profile` - Update user profile
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: `{ profileData }`

- `POST /api/profile/upload-avatar` - Upload profile avatar
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: `FormData: { image }`

- `PUT /api/profile/user-info` - Update user info (name, email)
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: `{ name, email }`

- `POST /api/profile/calculate-calories` - Calculate daily calorie goal
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: `{ profileData }`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication system
- **Keychain Integration**: Secure storage using react-native-keychain
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Cross-origin request security
- **Helmet Security Headers**: Additional HTTP security headers
- **Biometric Protection**: Enhanced security with device biometrics
- **Non-rolling Refresh Tokens**: Maintains same refresh token for better UX

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
