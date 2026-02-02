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
    { name: 'Faizan Safdar', fatherName: 'Safdar Khan', srNo: 'MSITS-SWL-23', regNo: '5837-01', issueDate: '05-8-2025', duration: '1-6-2025' },
    { name: 'M. Ubaid Ullah', fatherName: 'Allah Ditta', srNo: 'MSITS-SWL-24', regNo: '5837-01', issueDate: '05-8-2025', duration: '1-6-2025' },
    { name: 'M. Muneeb Raza', fatherName: 'Manzoor Hussain', srNo: 'MSITS-SWL-25', regNo: '5837-01', issueDate: '10-10-2025', duration: '4-9-2025' },
    { name: 'Abdul Haseeb Raza', fatherName: 'Manzoor Hussain', srNo: 'MSITS-SWL-26', regNo: '5837-01', issueDate: '10-10-2025', duration: '4-9-2025' },
    { name: 'M. Aqeel', fatherName: 'M. Sarfraz', srNo: 'MSITS-SWL-27', regNo: '5837-01', issueDate: '10-10-2025', duration: '4-9-2025' },
    { name: 'Qamar Abbas', fatherName: 'M. Aslam', srNo: 'MSITS-SWL-28', regNo: '5837-01', issueDate: '10-11-2025', duration: '5-10-2025' },
    { name: 'M. Taimoor', fatherName: 'M. Sajid', srNo: 'MSITS-SWL-29', regNo: '5837-01', issueDate: '10-12-2025', duration: '6-11-2025' },
    { name: 'M. Usman', fatherName: 'M. Shabaan', srNo: 'MSITS-SWL-30', regNo: '5837-01', issueDate: '10-12-2025', duration: '6-11-2025' },
    { name: 'M. Aftab', fatherName: 'Bilal', srNo: 'MSITS-SWL-31', regNo: '5837-01', issueDate: '10-12-2025', duration: '6-11-2025' },
    { name: 'Tofiq Shafiq', fatherName: 'M. Shafiq', srNo: 'MSITS-SWL-32', regNo: '5837-01', issueDate: '22-12-2025', duration: '6-11-2025' },
    { name: 'Hamraz Khan', fatherName: 'Ahsan Khan', srNo: 'MSITS-SWL-33', regNo: '5837-01', issueDate: '22-12-2025', duration: '6-11-2025' },
    { name: 'M. Abdul Rehman', fatherName: 'M. Arshad Naqshbandi', srNo: 'MSITS-SWL-34', regNo: '5837-01', issueDate: '30-4-2023', duration: '20-4-2022 to 25-4-2023' },
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
