import express from 'express';
import Book from '../models/Book.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all public books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ isPublic: true })
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Get all books (admin only)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find()
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Error fetching all books:', error);
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('uploadedBy', 'username');
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Error fetching book' });
  }
});

// Create book (admin only)
router.post('/', authenticateToken, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, description, course, isPublic } = req.body;
    
    let coverImage = '';
    let pdfUrl = '';

    if (req.files?.coverImage) {
      coverImage = `/uploads/covers/${req.files.coverImage[0].filename}`;
    }
    if (req.files?.pdf) {
      pdfUrl = `/uploads/books/${req.files.pdf[0].filename}`;
    }

    const book = new Book({
      title,
      author,
      description,
      course,
      coverImage,
      pdfUrl,
      uploadedBy: req.user.id,
      isPublic: isPublic === 'true' || isPublic === true
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Error creating book' });
  }
});

// Update book (admin only)
router.put('/:id', authenticateToken, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, description, course, isPublic } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.course = course || book.course;
    book.isPublic = isPublic !== undefined ? (isPublic === 'true' || isPublic === true) : book.isPublic;

    if (req.files?.coverImage) {
      book.coverImage = `/uploads/covers/${req.files.coverImage[0].filename}`;
    }
    if (req.files?.pdf) {
      book.pdfUrl = `/uploads/books/${req.files.pdf[0].filename}`;
    }

    await book.save();
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Error updating book' });
  }
});

// Delete book (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Error deleting book' });
  }
});

export default router;

