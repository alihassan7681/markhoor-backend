import express from 'express';
import Student from '../models/Student.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Register student
router.post('/register', async (req, res) => {
  try {
    const { name, fatherName, srNo, regNo, duration, issueDate, course, phone, email } = req.body;

    // Check if srNo already exists
    const existingStudent = await Student.findOne({ srNo });
    if (existingStudent) {
      return res.status(400).json({ error: 'Serial number already exists' });
    }

    const student = new Student({
      name,
      fatherName,
      srNo,
      regNo,
      duration,
      issueDate,
      course,
      phone,
      email
    });

    await student.save();
    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    console.error('Error registering student:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Serial number already exists' });
    }
    res.status(500).json({ error: 'Error registering student' });
  }
});

// Verify student by serial number
router.get('/verify/:srNo', async (req, res) => {
  try {
    const student = await Student.findOne({ srNo: req.params.srNo });
    if (!student) {
      return res.status(404).json({ error: 'Student not found with this serial number' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error verifying student:', error);
    res.status(500).json({ error: 'Error verifying student' });
  }
});

// Create student (admin only)
router.post('/', authenticateToken, upload.single('certificate'), async (req, res) => {
  try {
    console.log('📝 Creating student...');
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    const { name, fatherName, srNo, regNo, duration, issueDate, course, phone, email, status } = req.body;

    if (!name || !fatherName || !srNo || !course) {
      return res.status(400).json({ error: 'Name, Father Name, Serial Number, and Course are required' });
    }

    // Check if srNo already exists
    const existingStudent = await Student.findOne({ srNo });
    if (existingStudent) {
      console.log(`❌ Serial number ${srNo} already exists`);
      return res.status(400).json({ error: 'Serial number already exists' });
    }

    const student = new Student({
      name: name.trim(),
      fatherName: fatherName.trim(),
      srNo: srNo.trim(),
      regNo: regNo ? regNo.trim() : '',
      duration: duration ? duration.trim() : '',
      issueDate: issueDate ? issueDate.trim() : '',
      course: course.trim(),
      phone: phone ? phone.trim() : '',
      email: email ? email.trim() : '',
      status: status || 'pending'
    });

    if (req.file) {
      student.certificateUrl = `/uploads/certificates/${req.file.filename}`;
      console.log('📄 Certificate uploaded:', student.certificateUrl);
    }

    await student.save();
    console.log('✅ Student created successfully:', student.srNo);
    res.status(201).json(student);
  } catch (error) {
    console.error('❌ Error creating student:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Serial number already exists' });
    }
    res.status(500).json({ error: error.message || 'Error creating student' });
  }
});

// Get all students (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const students = await Student.find().sort({ registeredAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

// Get single student (admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Error fetching student' });
  }
});

// Update student (admin only)
router.put('/:id', authenticateToken, upload.single('certificate'), async (req, res) => {
  try {
    const { name, fatherName, srNo, regNo, duration, issueDate, course, phone, email, status } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    student.name = name || student.name;
    student.fatherName = fatherName || student.fatherName;
    student.srNo = srNo || student.srNo;
    student.regNo = regNo || student.regNo;
    student.duration = duration || student.duration;
    student.issueDate = issueDate || student.issueDate;
    student.course = course || student.course;
    student.phone = phone || student.phone;
    student.email = email || student.email;
    student.status = status || student.status;

    if (req.file) {
      student.certificateUrl = `/uploads/certificates/${req.file.filename}`;
    }

    await student.save();
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Error updating student' });
  }
});

// Delete student (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Error deleting student' });
  }
});

export default router;

