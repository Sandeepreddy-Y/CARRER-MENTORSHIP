# CareerMentor Backend Documentation

## Overview

The backend is a Node.js/Express application that provides RESTful APIs for the CareerMentor platform.

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server runs on `http://localhost:5000` by default.

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/career-mentorship
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

## API Structure

### Middleware
- `auth.js` - Authentication and authorization middleware

### Models
- `User.js` - User schema (students, counsellors, admins)
- `CareerResource.js` - Career path resources
- `CounsellingSession.js` - Counselling sessions
- `UserEngagement.js` - User activity tracking

### Controllers
- `authController.js` - Authentication logic
- `careerResourceController.js` - Resource management
- `sessionController.js` - Session management
- `adminController.js` - Admin operations

### Routes
- `/api/auth` - Authentication endpoints
- `/api/resources` - Career resources
- `/api/sessions` - Counselling sessions
- `/api/admin` - Admin operations

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Database

MongoDB is used as the database. Make sure MongoDB is running locally or update the `MONGODB_URI` to use MongoDB Atlas.

### Collections
- users
- careerresources
- counsellingsessions
- userengagements

## Security

- Passwords are hashed using bcryptjs
- JWT tokens expire in 7 days
- CORS is enabled for frontend communication
- Input validation using express-validator

## Dependencies

- Express.js - Web framework
- Mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment configuration
- cors - Cross-Origin Resource Sharing
- express-validator - Input validation

## Development

### Adding New Routes

1. Create a new file in `src/routes/`
2. Define your routes
3. Import and use in `src/index.js`

### Adding New Models

1. Create a new file in `src/models/`
2. Define your Mongoose schema
3. Export the model

### Adding New Controllers

1. Create a new file in `src/controllers/`
2. Implement your business logic
3. Import and use in your routes
