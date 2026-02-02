import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/Course.js';
import Book from '../models/Book.js';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get an admin to associate with books
        const admin = await Admin.findOne();
        if (!admin) {
            console.error('No admin found. Please create an admin first.');
            process.exit(1);
        }

        // Clear existing data to avoid duplicates
        await Course.deleteMany({});
        await Book.deleteMany({});
        console.log('Cleared existing courses and books');

        // Courses to add
        const courses = [
            {
                name: 'Full Stack Web Development',
                description: 'Master the MERN stack (MongoDB, Express, React, Node.js) and build scalable web applications from scratch.',
                duration: '6 Months',
                fee: 45000,
                image: '/uploads/covers/full_stack.png'
            },
            {
                name: 'Data Science & Machine Learning',
                description: 'Learn Python, Pandas, Scikit-Learn, and TensorFlow to analyze data and build predictive models.',
                duration: '8 Months',
                fee: 55000,
                image: '/uploads/covers/data_science.png'
            },
            {
                name: 'Cyber Security Professional',
                description: 'Protect networks and systems from digital attacks. Learn ethical hacking, encryption, and threat analysis.',
                duration: '6 Months',
                fee: 50000,
                image: '/uploads/covers/cyber_security.png'
            },
            {
                name: 'Mobile App Development (React Native)',
                description: 'Build cross-platform mobile apps for iOS and Android using a single codebase with React Native.',
                duration: '4 Months',
                fee: 40000,
                image: '/uploads/covers/mobile_dev.png'
            },
            {
                name: 'Cloud Computing (AWS/Azure)',
                description: 'Master cloud infrastructure, serverless computing, and DevOps practices on leading cloud platforms.',
                duration: '5 Months',
                fee: 48000,
                image: '/uploads/covers/cloud_computing.png'
            },
            {
                name: 'Digital Marketing Mastery',
                description: 'Master SEO, SEM, social media marketing, and content strategy to grow businesses online.',
                duration: '3 Months',
                fee: 30000,
                image: '/uploads/covers/digital_marketing.png'
            },
            {
                name: 'Graphic Design & UI/UX',
                description: 'Learn Adobe Suite, Figma, and design principles to create stunning visuals and user-centered interfaces.',
                duration: '4 Months',
                fee: 35000,
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop'
            },
            {
                name: 'Python for Beginners to Pro',
                description: 'Start from the basics and move to advanced automation, web scraping, and backend development with Python.',
                duration: '3 Months',
                fee: 25000,
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop'
            }
        ];

        // Books to add
        const books = [
            {
                title: 'Eloquent JavaScript',
                author: 'Marijn Haverbeke',
                description: 'A modern introduction to programming with JavaScript, covering the basics to advanced concepts.',
                course: 'Web Development',
                coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop',
                pdfUrl: 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'Clean Code',
                author: 'Robert C. Martin',
                description: 'A handbook of agile software craftsmanship that every programmer should read.',
                course: 'Software Engineering',
                coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop',
                pdfUrl: 'https://www.cs.upc.edu/~robert/teaching/is/CleanCode.pdf',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'You Don\'t Know JS',
                author: 'Kyle Simpson',
                description: 'A deep dive into the core mechanisms of JavaScript that every developer needs to understand.',
                course: 'Web Development',
                coverImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=2071&auto=format&fit=crop',
                pdfUrl: 'https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/README.md',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'The Pragmatic Programmer',
                author: 'Andrew Hunt & David Thomas',
                description: 'One of the most significant books on software development, covering process, ethics, and practices.',
                course: 'Software Engineering',
                coverImage: 'https://images.unsplash.com/photo-1543004218-283020ee3fdf?q=80&w=1974&auto=format&fit=crop',
                pdfUrl: 'https://www.cs.colorado.edu/~kena/classes/5828/s12/presentation-materials/huntthomas.pdf',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
                author: 'Aurélien Géron',
                description: 'Practical guide to building intelligent systems with the most popular libraries.',
                course: 'Data Science',
                coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop',
                pdfUrl: 'https://example.com/sample_ml_book.pdf',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'Computer Networking: A Top-Down Approach',
                author: 'James Kurose & Keith Ross',
                description: 'Comprehensive guide to networking protocols and architectures.',
                course: 'Cyber Security',
                coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop',
                pdfUrl: 'https://example.com/networking_guide.pdf',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'Python Crash Course',
                author: 'Eric Matthes',
                description: 'A hands-on, project-based introduction to programming with Python.',
                course: 'Python Programming',
                coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
                pdfUrl: 'https://example.com/python_crash_course.pdf',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'Cracking the Coding Interview',
                author: 'Gayle Laakmann McDowell',
                description: '189 programming questions and solutions to help you ace technical interviews.',
                course: 'Software Engineering',
                coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
                pdfUrl: 'https://example.com/coding_interview_prep.pdf',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'Learning React',
                author: 'Alex Banks & Eve Porcello',
                description: 'A functional approach to building browser-based applications with React.',
                course: 'Web Development',
                coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
                pdfUrl: 'https://example.com/react_guide.pdf',
                uploadedBy: admin._id,
                isPublic: true
            },
            {
                title: 'Don\'t Make Me Think',
                author: 'Steve Krug',
                description: 'A common-sense approach to web usability and user experience design.',
                course: 'UI/UX Design',
                coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop',
                pdfUrl: 'https://example.com/usability_best_practices.pdf',
                chapters: [
                    'Introduction to Usability',
                    'The First Law of Usability',
                    'How People Use the Web',
                    'Design for Scanning',
                    'Navigation and Hierarchy',
                    'The Power of Conventions',
                    'Omit Needless Words',
                    'Making Search Useful',
                    'Accessibility Basics',
                    'User Testing on a Budget',
                    'Mobile Usability Challenges',
                    'Agile and UX Integration',
                    'Continuous Improvement',
                    'Case Studies and Success'
                ],
                uploadedBy: admin._id,
                isPublic: true
            }
        ];

        // Use insertMany for efficiency
        await Course.insertMany(courses);
        console.log('Courses seeded successfully');

        await Book.insertMany(books);
        console.log('Books seeded successfully');

        mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
