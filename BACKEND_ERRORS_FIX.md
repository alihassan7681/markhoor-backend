# Backend Errors Fix Guide

## ✅ Fixed: .env file created!

## Common Backend Errors & Solutions:

### 1. MongoDB Connection Error
**Error:** `❌ MongoDB connection error: ...`

**Solution:**
- Make sure MongoDB is running
- If using MongoDB Atlas: ensure your cluster is accessible and add your IP under **Network Access** (or use `0.0.0.0/0` for testing). If using local MongoDB, start the service:
  ```bash
  # Windows (if installed as service)
  net start MongoDB
  ```
- Check MongoDB URI in `.env` file:
  ```
  MONGODB_URI=mongodb://localhost:27017/markhoor-institute
  ```

### 2. Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
- Change port in `.env` file:
  ```
  PORT=5001
  ```
- Or kill the process using port 5000:
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### 3. Module Not Found Error
**Error:** `Cannot find module '...'`

**Solution:**
```bash
cd backend
npm install
```

### 4. JWT_SECRET Missing
**Error:** `JWT_SECRET is not defined`

**Solution:**
- Make sure `.env` file exists in `backend/` folder
- Check `.env` has:
  ```
  JWT_SECRET=markhoor-institute-secret-key-2024-change-in-production
  ```

### 5. Syntax Error in Code
**Error:** `SyntaxError: ...`

**Solution:**
- Check the file mentioned in error
- Make sure all imports are correct
- Verify file extensions (.js not .jsx for backend)

## 🚀 Quick Start:

1. **Make sure MongoDB is running**

2. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Expected Output:**
   ```
   ✅ Connected to MongoDB
   🚀 Server running on port 5000
   ```

## 📝 Test Backend:

Open browser and go to:
```
http://localhost:5000/api/health
```

Should show:
```json
{
  "status": "OK",
  "message": "Markhoor Institute API is running"
}
```

## 🔧 If Still Having Issues:

1. Check terminal for exact error message
2. Verify MongoDB is running
3. Check `.env` file exists and has correct values
4. Restart the backend server

