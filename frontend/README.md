# CareerMentor Frontend Documentation

## Overview

The frontend is a React application that provides a user interface for the CareerMentor platform.

## Getting Started

### Installation

```bash
cd frontend
npm install
```

### Running the Application

```bash
npm start
```

The application will open at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Project Structure

### Pages
- `pages/Login.js` - User login page
- `pages/Register.js` - User registration page
- `pages/Dashboard.js` - User dashboard
- `pages/CareerPaths.js` - Career exploration page
- `pages/ScheduleSession.js` - Session scheduling page
- `pages/AdminDashboard.js` - Admin dashboard

### Components
- `components/Navigation.js` - Main navigation bar

### Context
- `context/AuthContext.js` - Authentication and user state management

### API
- `api/client.js` - Axios HTTP client with interceptors

### Styles
- `styles/Auth.css` - Authentication pages styling
- `styles/Dashboard.css` - Dashboard styling
- `styles/CareerPaths.css` - Career paths page styling
- `styles/ScheduleSession.css` - Session scheduling styling
- `styles/AdminDashboard.css` - Admin dashboard styling
- `components/Navigation.css` - Navigation styling

## Dependencies

- React 18.2 - UI library
- React Router v6 - Routing
- Axios - HTTP client

## Features

### Authentication
- Register new accounts
- Login with credentials
- Persistent session using JWT tokens
- Automatic logout on token expiration

### Student Features
- View dashboard with quick stats
- Explore career paths and resources
- Schedule counselling sessions
- Track session history

### Counsellor Features
- View assigned students
- Manage counselling sessions
- Add feedback and notes

### Admin Features
- View platform analytics
- Manage users
- Track engagement metrics
- Connect students with counsellors

## Development

### Creating New Pages

1. Create a new file in `src/pages/`
2. Import necessary components and hooks
3. Add the route in `App.js`

### Creating New Components

1. Create a new file in `src/components/`
2. Import styling if needed
3. Use the component in pages

### Adding API Calls

Add new API methods in `src/api/client.js`:

```javascript
export const newAPI = {
  getEndpoint: (params) => apiClient.get('/endpoint', { params }),
  postEndpoint: (data) => apiClient.post('/endpoint', data)
};
```

### Using Authentication

Use the `useAuth()` hook to access authentication context:

```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

## Styling

The application uses CSS with the following color scheme:
- Primary: #667eea (Purple-blue)
- Secondary: #764ba2 (Dark purple)
- Success: #27ae60 (Green)
- Warning: #f39c12 (Orange)
- Danger: #e74c3c (Red)

## Testing

Run tests with:
```bash
npm test
```

## Building

To build for production:
```bash
npm run build
```

This creates an optimized build in the `build/` directory.

## Deployment

The frontend can be deployed to various platforms:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

Make sure to set the `REACT_APP_API_URL` environment variable pointing to your backend server.
