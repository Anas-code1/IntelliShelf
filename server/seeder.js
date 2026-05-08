const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Book.deleteMany();

    const createdUsers = await User.create([
      { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
      { name: 'Librarian User', email: 'librarian@example.com', password: 'password123', role: 'librarian' },
      { name: 'Member User', email: 'member@example.com', password: 'password123', role: 'member' }
    ]);

    const adminUser = createdUsers[0]._id;

    const sampleBooks = [
      { isbn: '978-0-7432-7356-5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', quantity: 12, available: 12 },
      { isbn: '978-0-452-28423-4', title: '1984', author: 'George Orwell', category: 'Fiction', quantity: 15, available: 15 },
      { isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', quantity: 10, available: 10 },
    ];

    await Book.insertMany(sampleBooks);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
