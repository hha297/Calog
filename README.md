# Calog - Authentication UI Demo

A production-quality UI-only authentication flow built with React Native, TypeScript, and NativeWind (Tailwind CSS). This implementation provides a complete authentication interface ready to be wired to real APIs and authentication services.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- React Native development environment
- iOS Simulator or Android Emulator

### Installation & Running

```bash
# Install dependencies
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android

# Start Metro bundler
npm start
```

## 📱 Features

### Screens Implemented

- **Login Screen**: Email/password authentication with OAuth options
- **Signup Screen**: User registration with form validation
- **Forgot Password**: Password reset flow with email confirmation
- **Profile Screen**: User account management with demo state notice

### UI Components

- **Button**: Primary, ghost, and secondary variants with loading states
- **TextField**: Form inputs with labels, validation, and secure text entry
- **OAuthButton**: Google and Apple authentication buttons (UI only)

### Form Validation

- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Real-time error display
- Client-side validation only

## 🎨 Design System

### Color Palette

- **Primary**: `#142b30` (Dark blue/black)
- **Secondary**: `#1e3738` (Darker blue)
- **Tertiary**: `#4CAF50` (Green)
- **Accent**: `#FFC107` (Yellow/amber)

### Typography

- **Font Family**: Space Grotesk (Regular, Medium, Bold, Light, SemiBold)
- **Text Colors**: Primary, Secondary, Light, Muted

### Theme

- Dark theme optimized for mobile
- High contrast for accessibility
- Modern card-based layouts
- Consistent spacing and border radius

## 🔧 Implementation Guide

### Where to Plug Real Authentication

#### 1. API Integration (`src/screens/auth/`)

**Login Screen** (`LoginScreen.tsx`):

```typescript
// TODO: wire to real endpoint
// TODO: persist token with SecureStore/Keychain
// TODO: add JWT refresh + logout flow

// Replace mock setTimeout with real API call:
const response = await authAPI.login(formData);
await SecureStore.setItemAsync('authToken', response.token);
```

**Signup Screen** (`SignupScreen.tsx`):

```typescript
// TODO: wire to real endpoint
// TODO: persist token with SecureStore/Keychain
// TODO: add JWT refresh + logout flow

// Replace mock setTimeout with real API call:
const response = await authAPI.signup(formData);
await SecureStore.setItemAsync('authToken', response.token);
```

**Forgot Password Screen** (`ForgotPasswordScreen.tsx`):

```typescript
// TODO: wire to real endpoint
// TODO: add proper error handling for network failures

// Replace mock setTimeout with real API call:
await authAPI.forgotPassword(email);
```

#### 2. OAuth Integration (`src/components/ui/OAuthButton.tsx`)

**Google OAuth**:

```typescript
// TODO: Implement Google OAuth with react-native-app-auth
import { authorize } from 'react-native-app-auth';

const googleConfig = {
        issuer: 'https://accounts.google.com',
        clientId: 'YOUR_GOOGLE_CLIENT_ID',
        redirectUrl: 'com.yourapp://oauth',
        scopes: ['openid', 'profile', 'email'],
};

const handleGoogleAuth = async () => {
        const result = await authorize(googleConfig);
        // Handle OAuth result
};
```

**Apple OAuth**:

```typescript
// TODO: Implement Apple OAuth with react-native-app-auth
const appleConfig = {
        issuer: 'https://appleid.apple.com',
        clientId: 'YOUR_APPLE_CLIENT_ID',
        redirectUrl: 'com.yourapp://oauth',
        scopes: ['openid', 'name', 'email'],
};
```

#### 3. Secure Storage (`src/screens/ProfileScreen.tsx`)

**Logout Implementation**:

```typescript
// TODO: Clear JWT token from SecureStore/Keychain
// TODO: Clear user session data
// TODO: Reset navigation stack

import * as SecureStore from 'expo-secure-store';

const handleLogout = async () => {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // Clear user session data
        navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
        });
};
```

### Next Steps for Production

1. **Install Required Packages**:

      ```bash
      npm install react-native-app-auth expo-secure-store
      ```

2. **Create API Client** (`src/services/api/authApi.ts`):

      ```typescript
      export const authAPI = {
        login: (credentials) => fetch('/api/auth/login', { ... }),
        signup: (userData) => fetch('/api/auth/signup', { ... }),
        forgotPassword: (email) => fetch('/api/auth/forgot-password', { ... }),
      };
      ```

3. **Add Authentication Context** (`src/contexts/AuthContext.tsx`):

      ```typescript
      export const AuthProvider = ({ children }) => {
              const [user, setUser] = useState(null);
              const [isAuthenticated, setIsAuthenticated] = useState(false);
              // Implement auth state management
      };
      ```

4. **Implement Guarded Routes**:

      ```typescript
      // Add route protection based on authentication state
      const ProtectedRoute = ({ children }) => {
        return isAuthenticated ? children : <LoginScreen />;
      };
      ```

5. **Add JWT Refresh Logic**:
      ```typescript
      // Implement automatic token refresh
      const refreshToken = async () => {
              // Handle token refresh logic
      };
      ```

## 📁 Project Structure

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx          # Reusable button component
│       ├── TextField.tsx       # Form input component
│       ├── OAuthButton.tsx     # OAuth provider buttons
│       └── index.ts           # Component exports
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx     # Login interface
│   │   ├── SignupScreen.tsx    # Registration interface
│   │   ├── ForgotPasswordScreen.tsx # Password reset
│   │   └── index.ts           # Screen exports
│   └── ProfileScreen.tsx       # User profile (post-login)
├── navigation/
│   └── AuthNavigator.tsx      # Navigation stack
├── utils/
│   └── authValidation.ts      # Form validation utilities
└── types/
    └── index.ts              # TypeScript type definitions
```

## 🧪 Testing

The validation utilities are ready for unit testing:

```typescript
// Example test for email validation
import { validateEmail } from '../utils/authValidation';

test('validates email correctly', () => {
        expect(validateEmail('test@example.com')).toEqual({ isValid: true });
        expect(validateEmail('invalid-email')).toEqual({
                isValid: false,
                error: 'Please enter a valid email address',
        });
});
```

## 🎯 Acceptance Criteria Met

✅ **Launch app** → Login screen with email/password fields, OAuth buttons  
✅ **Form validation** → Real-time validation with inline error messages  
✅ **Navigation flow** → Login → Signup → Forgot Password → Profile  
✅ **Loading states** → Simulated with setTimeout for realistic UX  
✅ **Profile demo notice** → Clear "UI only" message with logout functionality  
✅ **Accessibility** → Proper contrast, tap targets, keyboard handling  
✅ **TypeScript** → Fully typed components and utilities  
✅ **Production ready** → Clean code structure with clear TODO markers

## 📝 Notes

- All authentication actions are stubbed with placeholder comments
- OAuth buttons show proper styling but don't perform real authentication
- Form validation is client-side only (no server validation yet)
- Navigation uses React Navigation v6 with native stack
- UI follows modern mobile design patterns with dark theme
- Code is organized for easy API integration

## 🔗 Dependencies

- `@react-navigation/native` - Navigation
- `@react-navigation/native-stack` - Stack navigator
- `react-native-safe-area-context` - Safe area handling
- `nativewind` - Tailwind CSS for React Native
- `react-native-linear-gradient` - Gradient backgrounds
- `react-native-svg` - SVG support

Ready for production authentication integration! 🚀
