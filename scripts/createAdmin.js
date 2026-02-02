import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/markhoor-institute');
    console.log('✅ Connected to MongoDB');

    // Get admin details from command line arguments or use defaults
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@markhoor.com';
    const password = process.argv[4] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('❌ Admin with this username already exists');
      process.exit(1);
    }

    // Create new admin (password will be hashed by pre-save hook)
    const admin = new Admin({
      username,
      email,
      password: password, // Will be hashed automatically by pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

