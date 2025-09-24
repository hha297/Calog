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

1. **Signup/Login** → Generate JWT tokens
2. **Protected Routes** → Verify JWT via middleware
3. **Token Refresh** → Rolling refresh token system
4. **Logout** → Revoke refresh tokens

## 🛠️ Development Guidelines

### Adding New Features

1. Create model in `/models/`
2. Add controller methods in `/controllers/`
3. Define routes in `/routes/`
4. Add validation middleware
5. Test endpoints

### Error Handling

- Use `ErrorUtils.asyncHandler` for async controllers
- Return errors via `ResponseUtils.error()`
- Global error handler catches unhandled errors

### Response Formatting

- Use `ResponseUtils.success()` for success responses
- Use `ResponseUtils.error()` for error responses
- Include appropriate HTTP status codes

## 🧪 Testing

```bash
# Start server
npm start

# Test endpoints
curl http://localhost:4000/health
curl -X POST http://localhost:4000/auth/signup -d '{"fullName":"Test","email":"test@test.com","password":"123456"}'
```

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
