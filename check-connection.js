import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/markhoor-institute';

console.log('🔍 Testing MongoDB connection...');
console.log(`📍 MongoDB URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}\n`);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('✅ You can now start the server with: npm run dev');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed!');
    console.error('   Error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. MongoDB is running');
    console.error("   2. If using MongoDB Atlas: ensure your cluster is accessible and add your IP under Network Access (or use 0.0.0.0/0 for testing). If using local MongoDB, make sure the service is running.");
    console.error('   3. MONGODB_URI in .env is correct');
    process.exit(1);
  });

