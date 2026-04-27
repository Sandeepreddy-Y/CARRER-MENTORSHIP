# API Reference Guide

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained by logging in or registering. Use the token returned in the response.

---

## Authentication Endpoints

### Register

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // Optional: student, counsellor (default: student)
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Get Profile

**Endpoint:** `GET /auth/profile`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "phone": "123-456-7890",
  "bio": "Aspiring software engineer",
  "interests": ["programming", "web development"],
  "skills": ["JavaScript", "React"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Profile

**Endpoint:** `PUT /auth/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "123-456-7890",
  "bio": "Aspiring software engineer",
  "interests": ["programming", "web development"],
  "skills": ["JavaScript", "React", "Node.js"]
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": { ...user object }
}
```

---

## Career Resources Endpoints

### Get All Resources

**Endpoint:** `GET /resources`

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title and description

**Response (200 OK):**
```json
[
  {
    "_id": "resource_id",
    "title": "Software Engineer",
    "description": "Build software applications...",
    "category": "IT",
    "skills": ["JavaScript", "Python", "Java"],
    "salary": {
      "min": 60000,
      "max": 150000,
      "currency": "USD"
    },
    "jobOutlook": "Growing",
    "educationRequired": "Bachelor's in Computer Science",
    "resourceLinks": [...]
  }
]
```

### Get Resource by ID

**Endpoint:** `GET /resources/:id`

**Response (200 OK):**
```json
{
  "_id": "resource_id",
  "title": "Software Engineer",
  ...full resource object
}
```

### Get Resources by Category

**Endpoint:** `GET /resources/category/:category`

**Categories:**
- Engineering
- Business
- Healthcare
- IT
- Finance
- Creative
- Education
- Other

**Response:** Array of resources in that category

### Create Resource (Admin Only)

**Endpoint:** `POST /resources`

**Authentication:** Required (Admin/Counsellor)

**Request Body:**
```json
{
  "title": "Data Scientist",
  "description": "Analyze data and build models...",
  "category": "IT",
  "skills": ["Python", "SQL", "Machine Learning"],
  "salary": {
    "min": 80000,
    "max": 180000,
    "currency": "USD"
  },
  "jobOutlook": "Very Growing",
  "educationRequired": "Master's in Data Science or related",
  "resourceLinks": [
    {
      "title": "Coursera Data Science Course",
      "url": "https://...",
      "type": "course"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Career resource created successfully",
  "resource": {...created resource}
}
```

### Update Resource (Admin Only)

**Endpoint:** `PUT /resources/:id`

**Authentication:** Required (Admin/Creator)

**Request Body:** Same as create (update only what you want to change)

**Response (200 OK):**
```json
{
  "message": "Career resource updated successfully",
  "resource": {...updated resource}
}
```

### Delete Resource (Admin Only)

**Endpoint:** `DELETE /resources/:id`

**Authentication:** Required (Admin/Creator)

**Response (200 OK):**
```json
{
  "message": "Career resource deleted successfully"
}
```

---

## Counselling Sessions Endpoints

### Get Available Counsellors

**Endpoint:** `GET /sessions/counsellors/available`

**Authentication:** Required

**Response (200 OK):**
```json
[
  {
    "_id": "counsellor_id",
    "name": "Dr. Sarah Smith",
    "email": "sarah@example.com",
    "phone": "123-456-7890",
    "bio": "Career counsellor with 10 years experience",
    "interests": ["IT", "Business"],
    "skills": ["Career Guidance", "Interview Prep"]
  }
]
```

### Schedule Session

**Endpoint:** `POST /sessions`

**Authentication:** Required (Student)

**Request Body:**
```json
{
  "counsellorId": "counsellor_id",
  "title": "Career Guidance Session",
  "description": "Discuss programming career path",
  "scheduledDate": "2024-02-15T14:00:00Z",
  "duration": 60
}
```

**Response (201 Created):**
```json
{
  "message": "Counselling session scheduled successfully",
  "session": {
    "_id": "session_id",
    "student": "student_id",
    "counsellor": "counsellor_id",
    "title": "Career Guidance Session",
    "status": "scheduled",
    "scheduledDate": "2024-02-15T14:00:00Z",
    "duration": 60
  }
}
```

### Get User Sessions

**Endpoint:** `GET /sessions`

**Authentication:** Required

**Response (200 OK):**
```json
[
  {
    "_id": "session_id",
    "student": {...student details},
    "counsellor": {...counsellor details},
    "title": "Career Guidance Session",
    "status": "scheduled",
    "scheduledDate": "2024-02-15T14:00:00Z"
  }
]
```

### Get Session by ID

**Endpoint:** `GET /sessions/:id`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "_id": "session_id",
  "student": {...},
  "counsellor": {...},
  "title": "Career Guidance Session",
  "description": "...",
  "status": "scheduled",
  "scheduledDate": "2024-02-15T14:00:00Z",
  "duration": 60,
  "notes": "...",
  "feedback": "..."
}
```

### Update Session Status (Counsellor Only)

**Endpoint:** `PUT /sessions/:id`

**Authentication:** Required (Counsellor/Admin)

**Request Body:**
```json
{
  "status": "completed",  // scheduled, completed, cancelled
  "notes": "Discussed career paths...",
  "feedback": "Student is well-prepared..."
}
```

**Response (200 OK):**
```json
{
  "message": "Session updated successfully",
  "session": {...updated session}
}
```

### Cancel Session

**Endpoint:** `DELETE /sessions/:id`

**Authentication:** Required (Student/Counsellor/Admin)

**Response (200 OK):**
```json
{
  "message": "Session cancelled successfully",
  "session": {...cancelled session}
}
```

---

## Admin Endpoints

**Note:** All admin endpoints require Admin or Counsellor role

### Get All Users

**Endpoint:** `GET /admin/users`

**Query Parameters:**
- `role` (optional): Filter by role (student, counsellor, admin)
- `search` (optional): Search by name or email

**Authentication:** Required (Admin/Counsellor)

**Response (200 OK):**
```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": "123-456-7890",
    "interests": ["IT", "Business"],
    "skills": ["JavaScript", "React"]
  }
]
```

### Get Dashboard Statistics

**Endpoint:** `GET /admin/stats/dashboard`

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "users": {
    "total": 50,
    "students": 40,
    "counsellors": 10
  },
  "sessions": {
    "total": 100,
    "completed": 85,
    "byStatus": [
      { "_id": "scheduled", "count": 10 },
      { "_id": "completed", "count": 85 },
      { "_id": "cancelled", "count": 5 }
    ]
  },
  "resources": {
    "total": 25
  },
  "engagement": {
    "total": 500
  },
  "topResources": [...]
}
```

### Get Engagement Statistics

**Endpoint:** `GET /admin/stats/engagement`

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `userId` (optional): Filter by specific user

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "engagementByType": [
    { "_id": "view_resource", "count": 150 },
    { "_id": "schedule_session", "count": 50 },
    { "_id": "complete_session", "count": 40 }
  ],
  "totalEngagements": 240,
  "activeUsersCount": 35,
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-02-01"
  }
}
```

### Get User Profile (Admin View)

**Endpoint:** `GET /admin/users/:userId`

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "user": {...user details},
  "recentEngagement": [...engagement records],
  "sessions": [...user sessions]
}
```

### Connect Student with Counsellor

**Endpoint:** `POST /admin/connect`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "studentId": "student_id",
  "counsellorId": "counsellor_id"
}
```

**Response (201 Created):**
```json
{
  "message": "Student connected with counsellor successfully",
  "session": {...new session}
}
```

### Deactivate User

**Endpoint:** `PUT /admin/users/:userId/deactivate`

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "message": "User account deactivated successfully",
  "user": {...user with updated role}
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

**Example Error Response:**
```json
{
  "message": "User already exists"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Add rate limiting middleware for production.

## Pagination

Add pagination support to `/resources` and `/sessions` endpoints for production use.

## Caching

Implement caching for frequently accessed resources to improve performance.
