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

### Frontend (React Native)

![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge&logo=zustand&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Lottie](https://img.shields.io/badge/Lottie-000000?style=for-the-badge&logo=lottie&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-000000?style=for-the-badge&logo=lucide&logoColor=white)

### Backend (Node.js)

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-000000?style=for-the-badge&logo=helmet&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-000000?style=for-the-badge&logo=cors&logoColor=white)

### External Services

![Open Food Facts](https://img.shields.io/badge/Open_Food_Facts-000000?style=for-the-badge&logo=openfoodfacts&logoColor=white)

## ✨ Key Features

### 📱 QR Code & Food Tracking

- **QR Code Scanning**: Scan food product barcodes using camera integration
- **Open Food Facts Integration**: Real-time food database lookup with comprehensive nutrition data
- **Food Diary**: Track daily food intake with detailed nutrition breakdown
- **Manual Food Entry**: Add food items manually when scanning isn't available
- **Nutrition Analysis**: Complete macronutrient tracking (calories, protein, carbs, fat, fiber, etc.)
- **Meal Categorization**: Organize food by meal types (breakfast, lunch, dinner, snacks)

### 🔐 Authentication & Security

- **Google OAuth Integration**: Secure sign-in with Google accounts
- **JWT Token Management**: Access tokens (15min) and refresh tokens (7 days)
- **Keychain Storage**: Secure token storage using device keychain
- **Biometric Protection**: Enhanced security with fingerprint/face recognition
- **Persistent Login**: Users stay logged in across app restarts
- **Auto-refresh**: Seamless token renewal for uninterrupted experience

### 📊 Advanced Body Composition Analysis

- **U.S. Navy Method**: Accurate body fat percentage calculation
- **Body Measurements Tracking**: Comprehensive tracking of neck, waist, hip, bicep, and thigh measurements
- **Fitness Metrics**: BMI, Body Fat Mass, Lean Body Mass, and FFMI calculations
- **Measurement History**: Track progress over time with trend analysis
- **Measurement Logs**: View and manage historical measurement data
- **Trend Indicators**: Visual indicators showing measurement changes (up/down/same)

### 🎯 Personalized Fitness Goals & Diet Plans

- **Weight Goals**: Lose, gain, or maintain weight with target setting
- **Calorie Calculation**: TDEE calculation using Mifflin-St Jeor equation
- **Activity Level Assessment**: Sedentary to very active lifestyle options
- **Diet Mode Selection**: Choose from 9 predefined diet plans (Balanced, Low Carb, High Protein, Keto, Atkins, Paleo, Mediterranean, DASH, Custom)
- **Custom Macronutrient Ratios**: Fine-tune carb/protein/fat percentages with wheel picker interface
- **Macro Validation**: Automatic validation ensuring macronutrients total exactly 100%
- **Diet Plan Persistence**: Save and sync diet preferences across devices

### 🚀 User Onboarding Experience

- **Interactive Onboarding**: Multi-slide introduction with smooth transitions
- **Welcome & Value Proposition**: Clear app benefits and features explanation
- **Basic Profile Setup**: Collect essential user information (age, gender, height, weight)
- **Goal Setting**: Personalized fitness goal configuration
- **Profile Validation**: Real-time form validation with user feedback
- **Local Storage**: Offline profile saving with cloud sync when available

### 📱 Modern UI/UX & Navigation

- **Dark/Light Mode**: Complete theme system with NativeWind v4
- **Theme Persistence**: User preference saved to AsyncStorage
- **Dynamic Components**: Theme-aware styling across all screens
- **Bottom Tab Navigation**: Intuitive navigation between main app sections
- **Modal Interfaces**: Smooth modal presentations for settings and data entry
- **Wheel Picker Components**: Intuitive number selection for measurements and macros
- **Custom UI Components**: Reusable components with consistent styling

### 📊 Analytics & Tracking

- **Daily Calorie Tracking**: Monitor calorie intake vs. goals
- **Weekly/Monthly Views**: Switch between different time periods
- **Calendar Integration**: Visual calendar for tracking progress
- **Progress Visualization**: Charts and graphs for fitness metrics
- **Analytics Dashboard**: Comprehensive overview of health and fitness data

### 🌍 Multi-Language Support

- **Static Translations**: Dictionary-based translations for UI elements
- **Dynamic Translation**: Google Translate API integration for dynamic content
- **Supported Languages**: English, Finnish, Vietnamese
- **Language Persistence**: User preference saved across sessions

### 📱 Cross-Platform Features

- **Deep Linking**: Custom URL scheme for authentication callbacks
- **Camera Integration**: Native camera access for barcode scanning
- **Image Picker**: Camera and gallery integration for photos
- **Permission Handling**: Proper camera and photo library permissions
- **BootSplash**: Custom launch screen with logo animation
- **Safe Area Support**: Proper handling of device notches and safe areas

### 🖥️ Backend Features

- **RESTful API**: Complete REST API with proper HTTP methods and status codes
- **MongoDB Integration**: Scalable NoSQL database with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication with refresh token rotation
- **Google OAuth**: Server-side Google authentication integration
- **Cloudinary Integration**: Image upload and management for user avatars
- **Rate Limiting**: API rate limiting to prevent abuse (100 requests per 15 minutes)
- **Security Headers**: Helmet.js for additional HTTP security headers
- **CORS Protection**: Cross-origin request security configuration
- **Input Validation**: Express-validator for request data validation
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Data Models**: Structured data models for Users, Food entries, and Measurements
- **Middleware Architecture**: Modular middleware for authentication and validation

## 📁 Project Structure

```text
calog/
├── src/                                            # React Native source code
│   ├── components/                                 # Reusable UI components
│   │   ├── ui/                                     # Base UI components (Button, TextField, etc.)
│   │   ├── profile/                                # Profile-related components
│   │   ├── home/                                   # Home screen components
│   │   ├── CameraView.tsx                          # Camera integration for barcode scanning
│   │   ├── DietModeModal.tsx                       # Diet plan selection modal
│   │   ├── MeasurementLogModal.tsx                 # Body measurements tracking
│   │   └── FoodItemCard.tsx                       # Food item display component
│   ├── screens/                                    # Application screens
│   │   ├── auth/                                   # Authentication screens (Login, Signup, etc.)
│   │   ├── onboarding/                             # User onboarding flow (4 slides)
│   │   ├── home/                                   # Home screens (Diary, Calendar)
│   │   ├── account/                                # Account management screens
│   │   ├── ScanScreen.tsx                          # Barcode scanning interface
│   │   ├── AnalyticsScreen.tsx                     # Analytics and progress tracking
│   │   └── HelpScreen.tsx                          # Help and support
│   ├── navigation/                                 # Navigation configuration
│   │   ├── AppNavigator.tsx                        # Main app navigation
│   │   ├── AuthNavigator.tsx                       # Authentication flow navigation
│   │   ├── MainNavigator.tsx                       # Main app tab navigation
│   │   └── AccountNavigator.tsx                     # Account section navigation
│   ├── services/                                   # API and external services
│   │   ├── api/                                    # API service modules
│   │   ├── googleSigninService.ts                  # Google OAuth integration
│   │   ├── measurementLogStorage.ts                # Local measurement storage
│   │   ├── onboardingStorage.ts                    # Onboarding data persistence
│   │   └── secureStorage.ts                        # Secure token storage
│   ├── hooks/                                      # Custom React hooks
│   │   ├── useAuth.ts                              # Authentication state management
│   │   ├── useUserProfile.ts                       # User profile data
│   │   ├── useFoodItems.ts                         # Food tracking functionality
│   │   └── useProfileSync.ts                       # Profile synchronization
│   ├── contexts/                                   # React contexts
│   │   ├── ThemeContext.tsx                        # Dark/Light theme management
│   │   └── index.ts                                # Context exports
│   ├── utils/                                      # Utility functions
│   │   ├── authValidation.ts                       # Authentication validation
│   │   ├── measurementUtils.ts                     # Body measurement calculations
│   │   └── helpers.ts                              # General helper functions
│   ├── types/                                      # TypeScript type definitions
│   │   ├── dietModes.ts                            # Diet plan type definitions
│   │   └── index.ts                                # Main type exports
│   └── store/                                      # State management
│       └── index.ts                                # Zustand store configuration
├── server/                                         # Node.js backend
│   ├── controllers/                                # Route controllers
│   │   ├── authController.js                       # Authentication logic
│   │   └── profileController.js                    # Profile management
│   ├── models/                                     # Database models
│   │   ├── User.js                                 # User schema
│   │   ├── Food.js                                 # Food entries schema
│   │   └── MeasurementLog.js                       # Body measurements schema
│   ├── routes/                                     # API routes
│   │   ├── auth.js                                 # Authentication endpoints
│   │   ├── profile.js                              # Profile endpoints
│   │   ├── food.js                                 # Food tracking endpoints
│   │   └── measurementLogs.js                      # Measurement endpoints
│   ├── middleware/                                 # Express middleware
│   │   └── auth.js                                 # JWT authentication middleware
│   ├── config/                                     # Configuration files
│   │   └── cloudinary.js                           # Cloudinary setup
│   └── utils/                                      # Server utilities
│       └── index.js                                # Utility functions
├── android/                                        # Android-specific configuration
├── ios/                                            # iOS-specific configuration
└── assets/                                         # Static assets (images, fonts)
    ├── bootsplash/                                 # App launch screen assets
    └── images/                                     # App images and icons
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

### Profile Management

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

### Food Tracking

- `GET /api/food` - Get user's food entries
     - **Headers**: `Authorization: Bearer <token>`
- `POST /api/food` - Add new food entry
     - **Headers**: `Authorization: Bearer <token>`
     - **Body**: `{ foodEntry }`
- `PUT /api/food/:id` - Update food entry
     - **Headers**: `Authorization: Bearer <token>`
     - **Body**: `{ updatedFoodEntry }`
- `DELETE /api/food/:id` - Delete food entry
     - **Headers**: `Authorization: Bearer <token>`

### Body Measurements

- `GET /api/measurement-logs` - Get user's measurement logs
     - **Headers**: `Authorization: Bearer <token>`
- `POST /api/measurement-logs` - Add new measurement log
     - **Headers**: `Authorization: Bearer <token>`
     - **Body**: `{ measurements }`
- `PUT /api/measurement-logs/:id` - Update measurement log
     - **Headers**: `Authorization: Bearer <token>`
     - **Body**: `{ updatedMeasurements }`
- `DELETE /api/measurement-logs/:id` - Delete measurement log
     - **Headers**: `Authorization: Bearer <token>`

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
