import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Student from '../models/Student.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/markhoor-institute';

const studentsData = [
    { name: 'M. Ahmad', fatherName: 'Musawar Islam', srNo: 'MSITS-SWL-01', regNo: '5837-01', issueDate: '10-10-2024', duration: '' },
    { name: 'M. Adnan', fatherName: 'M. Riaz', srNo: 'MSITS-SWL-02', regNo: '5837-01', issueDate: '10-10-2024', duration: '4-2024 to 10-2024' },
    { name: 'M. Wasif Khan', fatherName: 'Zafar Iqbal Khan', srNo: 'MSITS-SWL-03', regNo: '5837-01', issueDate: '28-10-2024', duration: '' },
    { name: 'Farzana Kausar', fatherName: 'Noor Muhammad', srNo: 'MSITS-SWL-04', regNo: '5837-01', issueDate: '28-10-2024', duration: '4-24 to 10-24' },
    { name: 'Aqsa Mazhar', fatherName: 'Mazhar Hussain', srNo: 'MSITS-SWL-05', regNo: '5837-01', issueDate: '10-01-2025', duration: '7-24 to 12-24' },
    { name: 'Abd-ul-Haseeb', fatherName: 'M. Sadiq', srNo: 'MSITS-SWL-06', regNo: '5837-01', issueDate: '10-02-2025', duration: '7-12-2024' },
    { name: 'Abd-ul-Rehman', fatherName: 'Liaquat Ali', srNo: 'MSITS-SWL-07', regNo: '5837-01', issueDate: '10-02-2025', duration: '7-12-2024' },
    { name: 'Sajjad Hussain', fatherName: 'Hafiz Alam Sher', srNo: 'MSITS-SWL-08', regNo: '5837-01', issueDate: '10-07-2024', duration: '7-23 to 7-24' },
    { name: 'Saba Zahoor', fatherName: 'Zahoor Iqbal', srNo: 'MSITS-SWL-09', regNo: '5837-01', issueDate: '08-05-2025', duration: '12-24 to 5-25' },
    { name: 'M. Saqlain Yousaf', fatherName: 'M. Yousaf', srNo: 'MSITS-SWL-10', regNo: '5837-01', issueDate: '09-07-2025', duration: '1-6-2025' },
    { name: 'M. Junaid', fatherName: 'M. Yaqoob', srNo: 'MSITS-SWL-11', regNo: '5837-01', issueDate: '03-01-25', duration: '1-12.2024' },
    { name: 'M. Fakhar Maqsood', fatherName: 'Maqsood Ahmad', srNo: 'MSITS-SWL-12', regNo: '5837-01', issueDate: '4-01-25', duration: '1-12.2024' },
    { name: 'Ayesha Munir', fatherName: 'M. Munir', srNo: 'MSITS-SWL-13', regNo: '5837-01', issueDate: '01-08-25', duration: '1-6-2025' },
    { name: 'Salman Imran', fatherName: 'Imran Khan', srNo: 'MSITS-SWL-14', regNo: '5837-01', issueDate: '01-08-25', duration: '1-6-2025' },
    { name: 'Ali Sher', fatherName: 'Waryam Ali', srNo: 'MSITS-SWL-15', regNo: '5837-01', issueDate: '01-07-24', duration: '1-6.2024' },
    { name: 'Sajid Ali', fatherName: 'Ali Ahmad', srNo: 'MSITS-SWL-16', regNo: '5837-01', issueDate: '05-08-25', duration: '7.24 to 7.25' },
    { name: 'Saad Dastgeer', fatherName: 'Ghulam Dastgeer', srNo: 'MSITS-SWL-17', regNo: '5837-01', issueDate: '05-08-25', duration: '7-24 to 7.25' },
    { name: 'Umar Draz', fatherName: 'M. Ali', srNo: 'MSITS-SWL-18', regNo: '5837-01', issueDate: '06-07-25', duration: '1-6-2025' },
    { name: 'Nisha Ashfaq', fatherName: 'M. Ashfaq', srNo: 'MSITS-SWL-19', regNo: '5837-01', issueDate: '01-Feb-24', duration: '7-12-2023' },
    { name: 'Arshiya Mumtaz', fatherName: 'Mumtaz Hussain', srNo: 'MSITS-SWL-20', regNo: '5837-01', issueDate: '01-07-25', duration: '1-6.2025' },
    { name: 'Mukhtar Ahmad', fatherName: 'Manzoor Ahmad', srNo: 'MSITS-SWL-21', regNo: '5837-01', issueDate: '01-02-2024', duration: '7-12-2023' },
    { name: 'Hasnain Meeran', fatherName: 'Meeran Khan', srNo: 'MSITS-SWL-22', regNo: '5837-01', issueDate: '05-09-2025', duration: '3-8.2025' },
];

const seedStudents = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const studentsToInsert = studentsData.map(student => ({
            ...student,
            course: 'Web Development',
            status: 'completed',
            registeredAt: new Date()
        }));

        console.log('🧹 Clearing existing students with same Sr. Nos...');
        const srNos = studentsToInsert.map(s => s.srNo);
        await Student.deleteMany({ srNo: { $in: srNos } });

        console.log('🌱 Seeding students...');
        await Student.insertMany(studentsToInsert);
        console.log(`✅ Successfully seeded ${studentsToInsert.length} students`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding students:', error);
        process.exit(1);
    }
};

seedStudents();
