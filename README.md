# Markhoor Institute Backend API

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/markhoor-institute
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Make sure MongoDB is running locally, or configure `MONGODB_URI` to use MongoDB Atlas (ensure your Atlas cluster has the appropriate Database User and Network Access IP whitelist)

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Books
- `GET /api/books` - Get all public books
- `GET /api/books/all` - Get all books (admin only)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Students
- `POST /api/students/register` - Register student
- `GET /api/students/verify/:srNo` - Verify student by serial number
- `GET /api/students` - Get all students (admin only)
- `GET /api/students/:id` - Get single student (admin only)
- `PUT /api/students/:id` - Update student (admin only)
- `DELETE /api/students/:id` - Delete student (admin only)

### Courses
- `GET /api/courses` - Get all active courses
- `GET /api/courses/all` - Get all courses (admin only)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

## Creating Admin User

You can create an admin user directly in MongoDB or use a script. Example:

```javascript
// In MongoDB Compass or MongoDB shell
use markhoor-institute
db.admins.insertOne({
  username: "admin",
  email: "admin@markhoor.com",
  password: "$2a$10$...", // bcrypt hashed password
  role: "admin"
})
```

Or use a password hashing tool to generate bcrypt hash for your password.

