# Backend Architecture - Calog

## 📁 Project Structure

```
server/
├── controllers/          # Business logic controllers
│   └── authController.js # Authentication controller
├── middleware/           # Express middleware
│   └── auth.js          # JWT authentication middleware
├── models/              # Database models
│   ├── User.js          # User model with auth methods
│   └── Food.js          # Food model (placeholder)
├── routes/               # API routes
│   └── auth.js          # Authentication routes
├── utils/                # Utility functions
│   └── index.js         # JWT, Response, Error utilities
├── .env                  # Environment variables
├── index.js             # Main server file
└── package.json         # Dependencies
```

## 🏗️ Architecture Pattern

### MVC (Model-View-Controller) Pattern

- **Models**: Database schemas and business logic
- **Views**: JSON responses (API)
- **Controllers**: Request handling and business logic
- **Routes**: URL routing and validation
- **Middleware**: Authentication, error handling
- **Utils**: Reusable utility functions

## 🔧 Key Components

### 1. **Controllers** (`/controllers/`)

- Handle business logic
- Process requests and responses
- Use `ErrorUtils.asyncHandler` for async error handling
- Return consistent responses via `ResponseUtils`

### 2. **Routes** (`/routes/`)

- Define API endpoints
- Handle input validation
- Call appropriate controllers
- Use middleware for authentication

### 3. **Models** (`/models/`)

- Define database schemas
- Include instance methods for business logic
- Handle password hashing, token management

### 4. **Middleware** (`/middleware/`)

- JWT authentication
- Request validation
- Error handling

### 5. **Utils** (`/utils/`)

- **JWTUtils**: Token generation and verification
- **ResponseUtils**: Consistent API responses
- **ErrorUtils**: Global error handling

## 🚀 Benefits of This Structure

### ✅ **Separation of Concerns**

- Routes only handle routing and validation
- Controllers contain business logic
- Models handle data operations
- Utils provide reusable functions

### ✅ **Error Handling**

- Global error handler catches all errors
- Consistent error responses
- Proper HTTP status codes

### ✅ **Maintainability**

- Easy to find and modify specific functionality
- Clear responsibilities for each component
- Reusable utility functions

### ✅ **Scalability**

- Easy to add new controllers and routes
- Consistent patterns across the codebase
- Modular architecture

## 📋 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // Optional validation errors
}
```

## 🔐 Authentication Flow

### Traditional Authentication

1. **Signup/Login** → Generate JWT tokens with refresh token
2. **Token Storage** → Refresh token stored securely in device keychain
3. **Auto-Login** → App automatically logs in using stored refresh token
4. **Token Refresh** → Non-rolling refresh token system (keeps same refresh token)
5. **Remember Me** → Extended refresh token expiry (7 days vs 1 day)
6. **Logout** → Revoke specific refresh token from database

### Google OAuth Authentication

1. **Google Sign-In** → Verify Google ID token
2. **User Creation/Linking** → Create new user or link to existing account
3. **Token Generation** → Generate JWT tokens for app access
4. **Persistent Login** → Same keychain storage as traditional auth

### Keychain Integration

- **Secure Storage**: Refresh tokens stored in device keychain/keystore
- **Biometric Protection**: User data protected with biometrics when available
- **Auto-Login**: Users stay logged in across app restarts
- **Cross-Session**: Login persists even after device restart

## 🛠️ Development Guidelines

### Adding New Features

1. Create model in `/models/`
2. Add controller methods in `/controllers/`
3. Define routes in `/routes/`
4. Add validation middleware

### Error Handling

- Use `ErrorUtils.asyncHandler` for async controllers
- Return errors via `ResponseUtils.error()`
- Global error handler catches unhandled errors

### Response Formatting

- Use `ResponseUtils.success()` for success responses
- Use `ResponseUtils.error()` for error responses
- Include appropriate HTTP status codes

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT token handling
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **cors**: Cross-origin requests
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **dotenv**: Environment variables

## 🗄️ Database Schema

### User Model

```javascript
{
    // Google OAuth fields
    googleId: String,        // Google OAuth ID (unique, sparse)
    name: String,            // Google display name
    avatar: String,          // Google profile picture

    // Traditional auth fields
    fullName: String,        // User's full name
    email: String,           // Email (required, unique)
    passwordHash: String,    // Hashed password (for traditional auth)
    role: String,           // 'free', 'premium', 'admin'

    // User Profile (collected during onboarding)
    profile: {
        gender: String,         // 'male', 'female', 'other'
        age: Number,           // 13-120 years
        height: Number,        // Height in cm (100-250)
        weight: Number,        // Weight in kg (30-300)
        activityLevel: String, // 'sedentary', 'light', 'moderate', 'active', 'very_active'
        goal: String,          // 'maintain', 'lose', 'gain'
        dailyCalorieGoal: Number // Calculated based on profile (800-5000)
    },

    // Refresh token management
    refreshTokens: [{
        token: String,        // Refresh token
        createdAt: Date,      // When token was created
        expiresAt: Date       // When token expires
    }],

    createdAt: Date,
    updatedAt: Date
}
```

### Profile Onboarding Flow

1. **Welcome Screen** → App introduction
2. **Value Proposition** → Benefits of using Calog
3. **Basic Profile** → Collect gender, age, height, weight
4. **Goal Setting** → Activity level and fitness goals
5. **Calorie Calculation** → Server calculates daily calorie goal
6. **Profile Sync** → Save to database and local storage
