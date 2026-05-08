const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  available: {
    type: Number,
    required: true,
    default: 1,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Available', 'Low Stock', 'Out of Stock'],
    default: 'Available',
  }
}, { timestamps: true });

// Pre-save middleware to update status based on availability
bookSchema.pre('save', function() {
  if (this.available === 0) {
    this.status = 'Out of Stock';
  } else if (this.available <= 3 && this.available > 0) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Available';
  }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
