const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book',
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  renewedOn: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Active', 'Returned', 'Overdue', 'Renewed', 'Reserved'],
    default: 'Active',
  },
  fine: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
