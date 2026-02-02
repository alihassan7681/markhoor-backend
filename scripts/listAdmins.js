import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const list = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admins = await Admin.find().select('-password');
    console.log('Admins:', admins.map(a => ({ username: a.username, email: a.email, role: a.role })));
    process.exit(0);
  } catch (err) {
    console.error('Error listing admins:', err);
    process.exit(1);
  }
};

list();
