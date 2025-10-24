# NutriAI Server

Backend API for NutriAI - AI Food Calorie Tracker

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file with the following variables:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nutriai
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. Start the server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Foods

- `GET /api/foods` - Get all foods
- `GET /api/foods/search?query=apple` - Search foods
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods` - Create new food

### Meals

- `GET /api/meals/user/:userId` - Get user meals
- `POST /api/meals` - Add meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal
