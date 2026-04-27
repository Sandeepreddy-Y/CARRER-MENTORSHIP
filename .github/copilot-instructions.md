# CareerMentor - Copilot Instructions

This document provides guidelines for developing and extending the CareerMentor platform using Copilot.

## Project Context

CareerMentor is a full-stack career mentorship platform with:
- **Backend**: Express.js with MongoDB
- **Frontend**: React with React Router
- **Database**: MongoDB with Mongoose ODM

## Code Style Guidelines

### JavaScript/Node.js
- Use `const` for variables, avoid `var`
- Use arrow functions
- Use async/await for asynchronous operations
- Use meaningful variable names

### React
- Use functional components with hooks
- Use `useContext` for global state management
- Keep components focused and modular
- Use PropTypes for type checking

### Database
- Always create indexes for frequently queried fields
- Use transactions for multi-document updates
- Validate data before saving

## Common Tasks

### Adding a New Feature

1. Create database model if needed
2. Implement backend controller logic
3. Create API routes
4. Implement frontend components
5. Connect frontend to API
6. Add styling
7. Test thoroughly

### Adding a New API Endpoint

1. Create controller method in appropriate controller file
2. Add route in corresponding routes file
3. Update API client in frontend
4. Add UI component to call the endpoint
5. Handle errors appropriately

### Adding Authentication to Routes

Use the provided middleware:
```javascript
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
router.get('/protected', authMiddleware, controllerFunction);
```

## File Locations

- Backend models: `backend/src/models/`
- Backend controllers: `backend/src/controllers/`
- Backend routes: `backend/src/routes/`
- Frontend pages: `frontend/src/pages/`
- Frontend components: `frontend/src/components/`
- Frontend styles: `frontend/src/styles/`

## Environment Setup

### Backend Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `PORT`: Server port (default 5000)
- `NODE_ENV`: Environment (development/production)

### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API URL

## Testing

### Manual Testing
- Test all user roles (student, counsellor, admin)
- Verify authentication flow
- Test API endpoints with Postman
- Check frontend UI responsiveness

## Error Handling

### Backend
- Return appropriate HTTP status codes
- Include error messages in response
- Log errors for debugging

### Frontend
- Display user-friendly error messages
- Handle network errors gracefully
- Show loading states

## Best Practices

1. **DRY Principle**: Don't repeat code, extract to utilities/components
2. **Separation of Concerns**: Keep business logic, UI, and data separate
3. **Input Validation**: Validate all user inputs
4. **Security**: Never expose sensitive data, hash passwords, use HTTPS
5. **Performance**: Optimize database queries, implement pagination
6. **Documentation**: Comment complex logic, maintain README files

## Project Structure

```
career-mentorship/
├── backend/           # Express.js server
│   ├── src/
│   │   ├── models/    # Database models
│   │   ├── routes/    # API routes
│   │   ├── controllers/ # Business logic
│   │   └── middleware/ # Auth & validation
│   └── index.js       # Server entry point
│
├── frontend/         # React application
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   ├── context/  # React context
│   │   ├── api/      # API client
│   │   └── styles/   # CSS files
│   └── index.js      # App entry point
│
└── README.md         # Main documentation
```

## Useful Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev         # Development server with nodemon
npm start           # Production server
```

### Frontend
```bash
cd frontend
npm install         # Install dependencies
npm start           # Development server
npm run build       # Build for production
npm test            # Run tests
```

## Debugging Tips

1. **Backend**: Check console logs and use debugger
2. **Frontend**: Use React DevTools browser extension
3. **Database**: Use MongoDB Compass for visual inspection
4. **API**: Use Postman for API testing
5. **Network**: Use browser DevTools Network tab

## Future Enhancements

- Email notifications
- Video conferencing for sessions
- Career aptitude tests
- Resume builder
- Interview preparation
- Mobile app
- Advanced analytics
- Chat/messaging
- Payment integration

Remember to test thoroughly and maintain code quality! 🚀
