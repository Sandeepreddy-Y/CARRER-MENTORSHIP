# Quick Start Guide

## 1. Start MongoDB

Ensure MongoDB is running locally or use MongoDB Atlas connection string.

## 2. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

## 3. Start Frontend Server

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend opens at `http://localhost:3000`

## 4. Create Test Accounts

### Student Account
- Go to `/register`
- Enter name and email
- Select "Student" as role
- Create password
- Click Register

### Counsellor Account
- Go to `/register`
- Enter name and email
- Select "Counsellor" as role
- Create password
- Click Register

### Admin Account
- Create a student account first
- Update the user role in MongoDB to "admin"

## 5. Test Features

### As Student
- [ ] Login to dashboard
- [ ] View career resources
- [ ] Explore career paths
- [ ] Schedule counselling session

### As Counsellor
- [ ] Login to dashboard
- [ ] View scheduled sessions
- [ ] Update session status

### As Admin
- [ ] Access admin dashboard
- [ ] View user statistics
- [ ] View engagement metrics

## API Testing with Postman

1. **Register**: `POST http://localhost:5000/api/auth/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "student"
   }
   ```

2. **Login**: `POST http://localhost:5000/api/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Get Resources**: `GET http://localhost:5000/api/resources`
   - Headers: `Authorization: Bearer <token>`

## Troubleshooting

### Can't connect to MongoDB
- Check if MongoDB is running
- Verify connection string in `.env`
- Try MongoDB Atlas connection

### Port already in use
- Change PORT in `.env` for backend
- Set `PORT=3001` environment variable for frontend

### Modules not found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to backend from frontend
- Verify backend is running
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend

## Development Tips

- Keep two terminals open: one for backend, one for frontend
- Frontend will hot-reload on file changes
- Backend requires restart when you change files (unless using nodemon)
- Use browser DevTools to debug frontend
- Use MongoDB Compass to inspect database

## Next Steps

1. Explore the codebase in `backend/` and `frontend/`
2. Read the detailed READMEs in each folder
3. Review API endpoints in backend documentation
4. Customize styles and features as needed
5. Deploy to production when ready

Happy coding! 🚀
