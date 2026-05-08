const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const connectDB = require('./config/db');
const https = require('https');

dotenv.config();
connectDB();

const addBooks = async () => {
  try {
    console.log('Generating 100 books...');
    
    const adjectives = ['The Great', 'Silent', 'Midnight', 'Hidden', 'Lost', 'Secret', 'Dark', 'Golden', 'Fallen', 'Eternal', 'Crimson', 'Shadow', 'Crystal', 'Iron', 'Broken'];
    const nouns = ['City', 'River', 'Mountain', 'Throne', 'Crown', 'Sword', 'Heart', 'Sun', 'Moon', 'Star', 'Truth', 'Lie', 'Dream', 'Nightmare', 'Empire'];
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
    const categories = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Romance', 'Mystery'];

    const books = [];

    for (let i = 0; i < 100; i++) {
      const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
      const author = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const category = categories[Math.floor(Math.random() * categories.length)];
      const qty = Math.floor(Math.random() * 15) + 3;
      
      books.push({
        isbn: `978-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9) + 1}`,
        title: title,
        author: author,
        category: category,
        quantity: qty,
        available: qty,
        status: 'Available',
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
      });
    }

    console.log(`Adding ${books.length} new books to the database...`);
    await Book.insertMany(books);
    console.log('Successfully added 100 books!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to add books:', error);
    process.exit(1);
  }
};

addBooks();
