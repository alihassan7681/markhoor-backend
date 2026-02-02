import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const router = express.Router();

// Unified Login (Admin & User)
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    // Check User model first (unified)
    let user = await User.findOne({ email: identifier });
    let role = 'user';
    let isAdmin = false;

    if (!user) {
      // Fallback to legacy Admin model
      user = await Admin.findOne({ $or: [{ username: identifier }, { email: identifier }] });
      role = 'admin';
      isAdmin = true;
    } else {
      role = user.role;
      isAdmin = role === 'admin';
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name || user.username,
        email: user.email,
        role: role,
        isAdmin: isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Firebase / Google Login
router.post('/firebase-login', async (req, res) => {
  console.log('📬 Received /firebase-login request:', req.body);
  try {
    const { uid, email, name, photoURL } = req.body;

    if (!uid || !email) {
      console.log('❌ Missing uid or email');
      return res.status(400).json({ error: 'Invalid Firebase user data' });
    }

    // Find user by firebaseUid or email
    let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });
    console.log('👤 User found in DB:', user ? user.email : 'None');

    if (!user) {
      console.log('🆕 Creating new user...');
      // Create new user if not exists
      user = new User({
        name: name || 'Google User',
        email: email,
        firebaseUid: uid,
        role: 'user'
      });
      await user.save();
      console.log('✅ New user created');
    } else if (!user.firebaseUid) {
      console.log('🔗 Linking firebaseUid to existing user');
      // Link firebaseUid to existing email user
      user.firebaseUid = uid;
      await user.save();
      console.log('✅ User linked');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🎟️ Token generated, sending response');
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('🔥 Firebase login error:', error);
    res.status(500).json({ error: 'Server error during Firebase login' });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check User model first
    let user = await User.findById(decoded.id).select('-password');
    let role = user?.role || 'user';

    if (!user) {
      // Fallback to legacy Admin model
      user = await Admin.findById(decoded.id).select('-password');
      role = 'admin';
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name || user.username,
        email: user.email,
        role: role,
        isAdmin: role === 'admin'
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;

