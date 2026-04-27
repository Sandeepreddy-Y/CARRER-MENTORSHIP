# CareerMentor Project Setup Guide

## Project Overview

CareerMentor is a full-stack web application providing career advice and mentorship services. The platform connects students with counsellors, offers career resources, and tracks engagement.

## Architecture

```
Frontend (React) <-> Backend (Express.js) <-> MongoDB
```

## Setup Instructions

### 1. Backend Setup

#### Prerequisites
- Node.js v14+ installed
- MongoDB running locally or MongoDB Atlas account

#### Steps

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/career-mentorship
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the development server:
```bash
npm run dev
```

Backend will be available at: `http://localhost:5000`

### 2. Frontend Setup

#### Prerequisites
- Node.js v14+ installed
- Backend running on port 5000

#### Steps

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

## Testing the Application

### User Types

1. **Student Account**
   - Email: student@example.com
   - Create via registration

2. **Counsellor Account**
   - Email: counsellor@example.com
   - Select "Counsellor" during registration

3. **Admin Account**
   - Create via direct database or registration, then update role to "admin"

### Features to Test

#### Student
- [ ] Login and view dashboard
- [ ] Browse career paths
- [ ] Schedule counselling session
- [ ] View session history

#### Counsellor
- [ ] Login to dashboard
- [ ] View assigned students
- [ ] Manage sessions
- [ ] Add session notes and feedback

#### Admin
- [ ] Access admin dashboard
- [ ] View statistics
- [ ] Manage users
- [ ] View engagement metrics

## Key Technologies

### Backend
- **Express.js** - REST API framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Resources
- `GET /api/resources` - List resources
- `GET /api/resources/:id` - Get resource
- `POST /api/resources` - Create (admin)
- `PUT /api/resources/:id` - Update (admin)
- `DELETE /api/resources/:id` - Delete (admin)

### Sessions
- `GET /api/sessions` - List user sessions
- `POST /api/sessions` - Schedule session
- `GET /api/sessions/:id` - Get session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Cancel session

### Admin
- `GET /api/admin/users` - List users
- `GET /api/admin/stats/dashboard` - Dashboard stats
- `GET /api/admin/stats/engagement` - Engagement stats
- `POST /api/admin/connect` - Connect student with counsellor

## Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change PORT in .env file to a different port
```

**MongoDB connection failed:**
```bash
# Ensure MongoDB is running
# Check MONGODB_URI in .env
```

**Modules not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Use different port
PORT=3001 npm start
```

**API connection issues:**
```bash
# Verify backend is running on correct port
# Check REACT_APP_API_URL in .env
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

1. Start backend server (Terminal 1):
```bash
cd backend && npm run dev
```

2. Start frontend server (Terminal 2):
```bash
cd frontend && npm start
```

3. Frontend automatically opens at `http://localhost:3000`

4. Make changes and they'll hot-reload

## Production Deployment

### Backend Deployment
- Deploy to Heroku, AWS, or DigitalOcean
- Set environment variables on hosting platform
- Use MongoDB Atlas for database

### Frontend Deployment
- Build: `npm run build`
- Deploy build folder to Netlify, Vercel, or AWS S3
- Set `REACT_APP_API_URL` to production backend URL

## Database Initialization

To seed initial data, you can create a seed script:

```javascript
// seed.js
const mongoose = require('mongoose');
const User = require('./src/models/User');
const CareerResource = require('./src/models/CareerResource');

// Add sample data...
```

Run with: `node seed.js`

## Performance Optimization

- Frontend: Enable code splitting, lazy loading
- Backend: Add caching, implement pagination
- Database: Create indexes for frequently queried fields

## Security Considerations

- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting
- Validate all user inputs
- Use CORS properly
- Keep dependencies updated

## Support & Documentation

- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Main README: `README.md`

## Next Steps

1. Review the READMEs in both backend and frontend directories
2. Set up your development environment
3. Run both servers
4. Test the core features
5. Extend with additional features as needed
