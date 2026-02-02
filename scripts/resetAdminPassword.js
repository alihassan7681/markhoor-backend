import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/markhoor-institute');
    console.log('✅ Connected to MongoDB');

    const username = process.argv[2] || 'admin';
    const newPassword = process.argv[3] || 'admin123';

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log(`❌ Admin with username "${username}" not found!`);
      console.log('💡 Creating new admin user...');
      
      // Create new admin
      const newAdmin = new Admin({
        username,
        email: 'admin@markhoor.com',
        password: newPassword, // Will be hashed by pre-save hook
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ New admin created successfully!');
    } else {
      console.log(`✅ Admin found: ${username}`);
      console.log('🔄 Resetting password...');
      
      // Update password (will be hashed by pre-save hook)
      admin.password = newPassword;
      admin.markModified('password'); // Force save to trigger pre-save hook
      await admin.save();
      console.log('✅ Password reset successfully!');
    }

    console.log(`\n📝 Login Credentials:`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${newPassword}`);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAdminPassword();

