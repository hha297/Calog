- **Avatar Upload**:
     - Image picker integration with camera and gallery support
     - Server-side upload to Cloudinary for security (client does NOT need .env)
     - Automatic image optimization (500x500, quality: auto, format: auto)
     - Old avatar cleanup to prevent storage bloat
     - Base64 conversion and upload with loading states
     - Permission handling for Android/iOS (Camera, Photo Library)g
- **Multi-Language Support**: Complete translation system with static dictionary and Google Translate API integration for dynamic content
- **Supported Languages**: English (en), Finnish (fi), Vietnamese (vi)
- **Dark/Light Mode**: Complete theme system with NativeWind v4, persistent preference storage, dynamic UI components, and theme-aware styling across all screens
- **Onboarding**: Multi-step profile collection with advanced weight goal settings
- **Weight Goals**: Lose/Gain weight with target weight and rate selection
- **Calorie Calculation**: TDEE and daily calorie goal calculation based on Mifflin-St Jeor equation
- **Body Composition Analysis**: Advanced body fat percentage calculation using U.S. Navy Method with cm measurements
- **Body Measurements**: Track neck, waist, hip, bicep, and thigh measurements
- **Fitness Metrics**: BMI, Body Fat Mass, Lean Body Mass, and FFMI calculations
- **Persistent Login**: Users stay logged in using device keychain
- **Avatar Upload**: Profile picture upload with Cloudinary integration, automatic image optimization, and old avatar cleanup

## 📋 System Requirements

- Node.js >= 20
- MongoDB
- React Native development environment
- Google Cloud Console account

## 🛠️ Installation

### 1. Clone and install dependencies

```bash
# Clone repository
git clone https://github.com/hha297/Calog.git
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

**Cloudinary Setup:**

1. Sign up at [Cloudinary](https://cloudinary.com/users/register/free)
2. Get your Cloud Name, API Key, and API Secret from the Dashboard
3. Add them to your server `.env` file

> **Note:** The React Native app does NOT need any `.env` file. All Cloudinary uploads are handled server-side for security.

### 5. Configure React Native OAuth

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

## 🌍 Translation System

Complete multi-language support with static dictionary + Google Translate API for dynamic content. Supports: English (en), Finnish (fi), Vietnamese (vi).

**For Developers:**

- **Add new translations**: Edit `src/utils/translations.ts` - add your key with translations for all languages
- **Add new languages**: Update `src/contexts/LanguageContext.tsx` (SupportedLanguage, LANGUAGE_NAMES, LANGUAGE_FLAGS) and add translations to all keys in `translations.ts`
- **Usage**: `<TranslatedText text="key" staticKey={true} />` or `const { t } = useTranslation(); await t('text');`
- **Examples**: See `src/examples/TranslationExample.tsx`

## 🔧 API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Handle Google OAuth callback
- `GET /auth/me` - Get current user info (requires JWT)
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout

### Profile

- `GET /api/profile` - Get user profile (requires JWT)
- `PUT /api/profile` - Update user profile (requires JWT)
- `POST /api/profile/upload-avatar` - Upload profile avatar (requires JWT)
- `PUT /api/profile/user-info` - Update user info (name, email) (requires JWT)
- `POST /api/profile/calculate-calories` - Calculate daily calorie goal

## 🗄️ Database Schema

### User Model

```javascript
{
    googleId: String,               // Google OAuth ID
    email: String,                  // Email (required)
    name: String,                   // Google display name
    avatar: String,                 // Google profile picture
    refreshToken: String,           // Google refresh token
    role: String,                   // 'free', 'premium', 'admin'
    profile: {
        gender: String,             // 'male', 'female', 'other'
        age: Number,                // 13-120
        height: Number,             // Height in cm (100-250)
        weight: Number,             // Weight in kg (30-300)
        activityLevel: String,      // 'sedentary', 'light', 'moderate', 'active', 'very_active'
        goal: String,               // 'maintain', 'lose', 'gain'
        targetWeight: Number,       // Target weight in kg (for lose/gain goals)
        weightChangeRate: Number,   // Weight change rate in kcal/day (100-1000)
        tdee: Number,               // Total Daily Energy Expenditure
        dailyCalorieGoal: Number    // Calculated daily calorie goal
    },
    createdAt: Date,
    updatedAt: Date
}
```

## 🔒 Security Features

- JWT access tokens (15 minutes)
- JWT refresh tokens (7 days for "Remember Me", 1 day otherwise)
- **Keychain Storage**: Refresh tokens stored securely in device keychain/keystore
- **Biometric Protection**: User data protected with biometrics when available
- **Persistent Login**: Users stay logged in across app restarts and device reboots
- **Auto-Refresh**: Seamless token refresh without user intervention
- Rate limiting (100 requests/15 minutes)
- CORS protection
- Helmet security headers
- Password hashing with bcrypt
- Non-rolling refresh token system (keeps same refresh token)

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
- NativeWind v4 for styling with dark mode support
- **Theme System**:
     - Complete dark/light mode implementation with ThemeContext
     - Dynamic UI components with theme-aware styling
     - Switcher component for theme toggle in Account settings
     - Theme preference saved to AsyncStorage with persistence
     - Auto StatusBar updates based on theme
     - Theme-aware styling for all screens: Login, Signup, Profile, Account, Home, Diary
     - Dynamic colors for icons, borders, backgrounds, and text
     - SplashScreen follows theme preference
     - OAuth buttons with theme-specific styling
     - Checkboxes and form elements adapt to theme
- **Translation System**:
     - Complete multi-language support with LanguageContext
     - Static text translations via dictionary (src/utils/translations.ts)
     - Dynamic content translation via Google Translate API
     - Language preference saved to AsyncStorage with persistence
     - Supported languages: English (en), Finnish (fi), Vietnamese (vi)
     - TranslatedText component for automatic static text translation
     - useTranslation hook for dynamic runtime translation
     - useTranslatedText hook for fixed text with automatic translation
     - LanguageSelector component with compact and full display modes
     - Language selection in Account settings
     - All UI elements support translation (navigation, screens, components)
- **Onboarding Flow**: Multi-step profile collection with advanced weight goal settings
- **Weight Goal System**: Target weight and rate selection with real-time pace labels
- **Calorie Calculation**: TDEE and daily calorie goal using Mifflin-St Jeor equation
- **Body Composition Analysis**:
     - U.S. Navy Method body fat percentage calculation (separate formulas for male/female)
     - Uses centimeters directly for convenience (original method uses inches)
     - Body measurements tracking (neck, waist, hip, bicep, thigh)
     - Comprehensive fitness metrics (BMI, Body Fat Mass, Lean Body Mass, FFMI)
     - Real-time calculation updates when measurements change
     - Reference: [U.S. Navy body fat estimation formula](https://med.libretexts.org/Courses/Irvine_Valley_College/Physiology_Labs_at_Home/03%3A_Anthropometrics/3.02%3A_Part_B-_Circumference_Measures/3.2.04%3A_Part_B4-_The_U.S._Navy_body_fat_estimation_formula)
- **Keychain Integration**: Secure storage using react-native-keychain
- **Profile Management**: Local storage with database sync
- **Auto-Login**: Persistent authentication across sessions
- **Avatar Upload**:
     - Image picker integration with camera and gallery support
     - Server-side upload to Cloudinary for security (client does NOT need .env)
     - Automatic image optimization (500x500, quality: auto, format: auto)
     - Old avatar cleanup to prevent storage bloat
     - Base64 conversion and upload with loading states
     - Permission handling for Android/iOS (Camera, Photo Library)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.
