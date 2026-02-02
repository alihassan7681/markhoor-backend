import express from 'express';
import Contact from '../models/Contact.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/contact-attachments'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// Submit contact form
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const { name, email, phone, subject, message, callbackRequest, preferredCallbackTime, honeypot } = req.body;

    // Honeypot spam protection
    if (honeypot) {
      return res.status(200).json({ 
        message: 'Thank you for your message! We will get back to you soon.' 
      });
    }

    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Name, email, phone, and message are required' });
    }

    // Get IP address and user agent for spam detection
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.get('user-agent') || '';

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      attachment: req.file ? `/uploads/contact-attachments/${req.file.filename}` : '',
      callbackRequest: callbackRequest === 'true' || callbackRequest === true,
      preferredCallbackTime: preferredCallbackTime || '',
      ipAddress: ipAddress,
      userAgent: userAgent,
      status: 'new'
    });

    await contact.save();

    // TODO: Send email notification to admin
    // TODO: Send auto-reply to user

    res.status(201).json({ 
      message: 'Thank you for your message! We will get back to you soon.',
      id: contact._id
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Error submitting contact form. Please try again later.' });
  }
});

// Get all contact submissions (admin only)
// Note: Add authentication middleware in production
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});

// Get single contact (admin only)
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Error fetching contact' });
  }
});

// Update contact status (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Error updating contact' });
  }
});

export default router;

