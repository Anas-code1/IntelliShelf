const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const backfillCovers = async () => {
  try {
    console.log('Backfilling book covers...');
    const books = await Book.find({ $or: [{ cover: { $exists: false } }, { cover: null }] });
    console.log(`Found ${books.length} books without covers.`);

    let updated = 0;
    for (const book of books) {
      // Generate a unique, consistent cover image based on the book's unique ID
      book.cover = `https://picsum.photos/seed/${book._id}/400/600`;
      await book.save();
      updated++;
    }

    console.log(`Successfully added covers to ${updated} books!`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to backfill covers:', error);
    process.exit(1);
  }
};

backfillCovers();
