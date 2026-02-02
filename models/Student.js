import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  srNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  regNo: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  issueDate: {
    type: String,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed'],
    default: 'pending'
  },
  certificateUrl: {
    type: String,
    default: ''
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Student', studentSchema);

