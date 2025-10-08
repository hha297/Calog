# Backend Architecture - Calog

## 📁 Project Structure

```
server/
├── controllers/          # Business logic controllers
│   ├── authController.js # Authentication controller
│   └── profileController.js # Profile, calorie calculation, and body composition controller
├── middleware/           # Express middleware
│   └── auth.js          # JWT authentication middleware
├── models/              # Database models
│   ├── User.js          # User model with auth methods
│   └── Food.js          # Food model (placeholder)
├── routes/               # API routes
│   ├── auth.js          # Authentication routes
│   ├── profile.js       # Profile management and body composition routes
│   └── food.js          # Food management routes
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
        gender: String,           // 'male', 'female', 'other'
        age: Number,              // 13-120 years
        height: Number,           // cm (100-250)
        weight: Number,           // kg (30-300) — kept in sync with latest 'weight' log
        activityLevel: String,    // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
        goal: String,             // 'maintain' | 'lose' | 'gain'
        targetWeight: Number,     // kg
        weightChangeRate: Number, // kcal/day (100-1000)
        tdee: Number,
        dailyCalorieGoal: Number,

        // Latest measurements snapshot (unitless values; units are standardized)
        measurements: {
            weight: Number, // kg
            waist: Number,  // cm
            hip: Number,    // cm
            neck: Number,   // cm
            thigh: Number,  // cm
            bicep: Number   // cm
        },

        updatedAt: Date
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

### Measurement Logs Model (updated)

Each save creates ONE document containing all measurements for that moment. Units are standardized (weight→kg, others→cm). We removed `recordedAt` and `input`; use `createdAt` from Mongoose timestamps.

```javascript
// measurement_logs
{
  _id: ObjectId,
  userId: ObjectId,
  measurements: {
    weight: { value: Number, unit: 'kg' },
    waist:  { value: Number, unit: 'cm' },
    hip:    { value: Number, unit: 'cm' },
    neck:   { value: Number, unit: 'cm' },
    thigh:  { value: Number, unit: 'cm' },
    bicep:  { value: Number, unit: 'cm' }
  },
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

```
db.measurement_logs.createIndex({ userId: 1, createdAt: -1 })
```

## Measurement Logs API (updated)

POST `/api/measurement-logs`

Request body:

```json
{
        "measurements": {
                "weight": { "value": 75, "unit": "kg" },
                "waist": { "value": 83, "unit": "cm" },
                "hip": { "value": 93, "unit": "cm" }
        }
}
```

Behavior:

- Creates a single log document for the batch
- Updates `user.profile.measurements` snapshot with provided values
- If a `weight` value is present, also updates `user.profile.weight`

GET `/api/measurement-logs`

- Returns logs for current user sorted by `createdAt` desc

DELETE `/api/measurement-logs/:id`

- Deletes a log and refreshes the user's `profile.measurements` snapshot to the latest remaining log
- If no logs remain, clears the snapshot

DELETE `/auth/account`

- Application-level cascade delete: removes all measurement logs for the user and then deletes the user (transactional)

### Profile Onboarding Flow

1. **Welcome Screen** → App introduction
2. **Value Proposition** → Benefits of using Calog
3. **Basic Profile** → Collect gender, age, height, weight, activity level
4. **Weight Goal Setting** → Advanced goal configuration:
      - Choose goal: Maintain, Lose, or Gain weight
      - Set target weight (for lose/gain goals)
      - Select daily calorie deficit/surplus (100-1000 kcal/day)
      - Real-time pace labels (Chill pace, Easy, Balanced, Hardcore, etc.)
5. **Calorie Calculation** → Server calculates TDEE and daily calorie goal using Mifflin-St Jeor equation
6. **Profile Sync** → Save to database and local storage

## 🧮 Calorie Calculation System

### Mifflin-St Jeor Equation

**BMR (Basal Metabolic Rate) Calculation:**

- **Male**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- **Female**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

**TDEE (Total Daily Energy Expenditure):**

- TDEE = BMR × Activity Multiplier

**Activity Multipliers:**

- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

**Daily Calorie Goal:**

- **Maintain**: TDEE
- **Lose**: TDEE - weightChangeRate (kcal/day)
- **Gain**: TDEE + weightChangeRate (kcal/day)

### Weight Goal Validation

- **Lose Weight**: Target weight must be less than current weight
- **Gain Weight**: Target weight must be greater than current weight
- **Weight Change Rate**: 100-1000 kcal/day for safe progress

## 🏃‍♂️ Body Composition Analysis System

### Navy Method Body Fat Calculation

The system uses the **U.S. Navy body fat estimation formula** to calculate body fat percentage with gender-specific formulas. While the original Navy Method uses inches, our implementation uses **centimeters directly** for convenience:

**For Males:**

```
Body Fat % = 86.01 × log₁₀(waist - neck) - 70.041 × log₁₀(height) + 36.76
```

**For Females:**

```
Body Fat % = 163.205 × log₁₀(waist + hip - neck) - 97.684 × log₁₀(height) - 78.387
```

> **Reference**: [U.S. Navy body fat estimation formula](https://med.libretexts.org/Courses/Irvine_Valley_College/Physiology_Labs_at_Home/03%3A_Anthropometrics/3.02%3A_Part_B-_Circumference_Measures/3.2.04%3A_Part_B4-_The_U.S._Navy_body_fat_estimation_formula) - Medicine LibreTexts

### Body Composition Metrics

**Calculated Metrics:**

- **Body Fat Percentage**: Primary metric using Navy Method
- **Body Fat Mass**: Total fat mass in kg (Body Fat % × Weight)
- **Lean Body Mass**: Muscle, bone, and organ mass (Weight - Body Fat Mass)
- **FFMI (Fat-Free Mass Index)**: Muscle mass relative to height (Lean Body Mass / Height²)

**Required Measurements:**

- **Males**: Neck and Waist circumference
- **Females**: Neck, Waist, and Hip circumference
- **Optional**: Bicep and Thigh measurements for tracking

### Measurement Validation

- **Neck**: 20-50 cm
- **Waist**: 50-150 cm
- **Hip**: 70-150 cm
- **Bicep**: 15-60 cm
- **Thigh**: 30-100 cm

### Real-time Updates

Body composition metrics are calculated in real-time when:

- Body measurements are updated
- Weight changes
- Profile information is modified

The frontend uses helper functions in `src/utils/helpers.ts` for consistent calculations across the app.
