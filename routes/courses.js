import express from 'express';
import Course from '../models/Course.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all active courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ name: 1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Get all courses (admin only)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Error fetching course' });
  }
});

// Create course (admin only)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, duration, fee, isActive } = req.body;

    let image = '';
    if (req.file) {
      image = `/uploads/covers/${req.file.filename}`; // Using covers directory for simplicity
    }

    const course = new Course({
      name,
      description,
      duration,
      fee,
      isActive: isActive !== undefined ? isActive : true,
      image
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Course name already exists' });
    }
    res.status(500).json({ error: 'Error creating course' });
  }
});

// Update course (admin only)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, duration, fee, isActive } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    course.name = name || course.name;
    course.description = description || course.description;
    course.duration = duration !== undefined ? duration : course.duration;
    course.fee = fee !== undefined ? fee : course.fee;
    course.isActive = isActive !== undefined ? isActive : course.isActive;

    if (req.file) {
      course.image = `/uploads/covers/${req.file.filename}`;
    }

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Error updating course' });
  }
});

// Delete course (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Error deleting course' });
  }
});

export default router;

