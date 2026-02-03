import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import contactRoutes from './routes/contact.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware - CORS Configuration (UPDATED)
// Middleware - CORS Configuration (UPDATED)
app.use(cors({
  origin: true, // Allow all origins for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add COOP/COEP headers to allow popups
app.use((req, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.header("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// Serve uploaded files with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(filePath) + '"');
    } else if (filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      res.setHeader('Content-Type', 'image/' + path.extname(filePath).slice(1));
    }
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contact', contactRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Global Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Markhoor Institute API is running' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/markhoor-institute';
const PORT = process.env.PORT || 5000;

console.log('🔌 Attempting to connect to MongoDB...');
console.log(`📍 MongoDB URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials if any

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at: http://localhost:${PORT}/api`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    });

    // Handle port already in use error
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.error('\n💡 Solutions:');
        console.error(`   1. Kill the process using port ${PORT}:`);
        console.error(`      netstat -ano | findstr :${PORT}`);
        console.error(`      taskkill /PID <PID> /F`);
        console.error(`   2. Or change PORT in .env file to a different port (e.g., 5001)`);
        console.error(`   3. Or wait a few seconds and try again\n`);
        process.exit(1);
      } else {
        throw error;
      }
    });
  })
  .catch((error) => {
    console.error('\n❌ MongoDB connection error:');
    console.error('   Error:', error.message);
    console.error('\n💡 Solutions:');
    console.error('   1. Make sure MongoDB is running');
    console.error('   2. Open MongoDB Compass and connect');
    console.error('   3. Check MONGODB_URI in .env file');
    console.error('   4. Verify MongoDB service is started\n');
    process.exit(1);
  });

export default app;