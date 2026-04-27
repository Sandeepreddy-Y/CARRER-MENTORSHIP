# CareerMentor - Career Advice and Mentorship Platform

A comprehensive full-stack web application that provides career advice and mentorship services to students. The platform connects students with career counsellors, offers curated career resources, and helps students make informed career decisions based on their interests and skills.

## Features

### For Students
- **Career Path Exploration**: Browse and explore various career paths with detailed information
- **Schedule Counselling Sessions**: Book sessions with professional career counsellors
- **View Career Resources**: Access curated content and materials for different career fields
- **Track Sessions**: Monitor scheduled and completed counselling sessions
- **Build Profile**: Create a profile with interests and skills for better matching

### For Counsellors
- **Manage Sessions**: View and manage student counselling sessions
- **Track Student Progress**: Monitor student engagement and activity
- **Provide Feedback**: Add notes and feedback after counselling sessions
- **Access Student Profiles**: View student information and history

### For Administrators
- **Dashboard Analytics**: View comprehensive platform statistics and metrics
- **User Management**: Manage student and counsellor accounts
- **Resource Management**: Create and manage career resources
- **Connect Students & Counsellors**: Manually assign counsellors to students
- **Engagement Tracking**: Monitor user engagement and platform usage
- **Content Management**: Manage career resources and educational content

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Library**: React 18.2
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3

## Project Structure

```
career-mentorship-platform/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── CareerResource.js
│   │   │   ├── CounsellingSession.js
│   │   │   └── UserEngagement.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── careerResourceRoutes.js
│   │   │   ├── sessionRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── careerResourceController.js
│   │   │   ├── sessionController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CareerPaths.js
│   │   │   ├── ScheduleSession.js
│   │   │   └── AdminDashboard.js
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   └── Navigation.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── CareerPaths.css
│   │   │   ├── ScheduleSession.css
│   │   │   └── AdminDashboard.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/career-mentorship
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Career Resources
- `GET /api/resources` - Get all career resources
- `GET /api/resources/:id` - Get resource by ID
- `GET /api/resources/category/:category` - Get resources by category
- `POST /api/resources` - Create new resource (admin only)
- `PUT /api/resources/:id` - Update resource (admin only)
- `DELETE /api/resources/:id` - Delete resource (admin only)

### Counselling Sessions
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/counsellors/available` - Get available counsellors
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Schedule new session
- `PUT /api/sessions/:id` - Update session status
- `DELETE /api/sessions/:id` - Cancel session

### Admin Dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats/dashboard` - Get dashboard statistics
- `GET /api/admin/stats/engagement` - Get engagement statistics
- `GET /api/admin/users/:userId` - Get user profile (admin view)
- `POST /api/admin/connect` - Connect student with counsellor
- `PUT /api/admin/users/:userId/deactivate` - Deactivate user account

## Authentication

The platform uses JWT (JSON Web Tokens) for authentication. When a user logs in or registers, they receive a token that must be included in the `Authorization` header for subsequent requests:

```
Authorization: Bearer <token>
```

## User Roles

1. **Student**: Can view career resources, schedule sessions, and manage their profile
2. **Counsellor**: Can view assigned students, manage sessions, and provide feedback
3. **Admin**: Full access to all features including user management and analytics

## Database Models

### User
- name, email, password, role
- phone, bio, profilePicture
- interests, skills
- timestamps

### CareerResource
- title, description, category
- skills, salary, jobOutlook, educationRequired
- resourceLinks
- createdBy (reference to User)
- timestamps

### CounsellingSession
- student, counsellor (references to User)
- title, description, scheduledDate, duration
- status, notes, feedback
- timestamps

### UserEngagement
- user (reference to User)
- actionType, resourceId, details
- createdAt

## Future Enhancements

- Email notifications for sessions
- Video conference integration for sessions
- Career aptitude tests and quizzes
- Resume builder
- Interview preparation resources
- Job matching based on skills
- Mobile application
- Advanced analytics and reporting
- Chat/messaging system
- Payment integration for premium features

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please contact the development team or create an issue in the repository.
