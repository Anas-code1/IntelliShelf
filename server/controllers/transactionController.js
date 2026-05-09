const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');
const mongoose = require('mongoose');

const findBookByIdentifier = async (identifier) => {
  const normalized = (identifier || '').trim();
  if (!normalized) return null;

  if (mongoose.Types.ObjectId.isValid(normalized)) {
    const byId = await Book.findById(normalized);
    if (byId) return byId;
  }

  return Book.findOne({ isbn: normalized });
};

const findMemberByIdentifier = async (identifier) => {
  const normalized = (identifier || '').trim();
  if (!normalized) return null;

  if (mongoose.Types.ObjectId.isValid(normalized)) {
    const byId = await User.findById(normalized);
    if (byId) return byId;
  }

  return User.findOne({ email: normalized.toLowerCase() });
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private (Staff see all, Members see their own)
const getTransactions = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (req.user.role.toLowerCase() === 'member') {
      query.member = req.user._id;
    }

    if (status && status !== 'all') {
      if (status === 'overdue') {
        query.status = 'Active';
        query.dueDate = { $lt: new Date() };
      } else {
        query.status = status;
      }
    }

    const transactions = await Transaction.find(query)
      .populate('book', 'title isbn author')
      .populate('member', 'name email')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Issue a book
// @route   POST /api/transactions/issue
// @access  Private/Staff
const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, days = 14 } = req.body;
    const book = await findBookByIdentifier(bookId);
    const member = await findMemberByIdentifier(memberId);

    if (!book || book.available <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }
    if (!member) {
      return res.status(400).json({ message: 'Member not found. Use member ID or email.' });
    }
    if (member.role.toLowerCase() !== 'member') {
      return res.status(400).json({ message: 'Selected user is not a library member' });
    }

    // Check if member already has this book active
    const existingTransaction = await Transaction.findOne({
      book: book._id,
      member: member._id,
      status: 'Active'
    });

    if (existingTransaction) {
      return res.status(400).json({ message: 'Member already has this book issued' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const transaction = await Transaction.create({
      book: book._id,
      member: member._id,
      dueDate
    });

    // Update book availability
    book.available -= 1;
    await book.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a book
// @route   POST /api/transactions/return/:id
// @access  Private/Staff
const returnBook = async (req, res) => {
  try {
    const rawId = (req.params.id || '').trim();
    let transaction = null;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      transaction = await Transaction.findById(rawId);
    } else {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }

    if (!transaction || transaction.status !== 'Active') {
      return res.status(400).json({ message: 'Valid active transaction not found' });
    }

    transaction.status = 'Returned';
    transaction.returnDate = new Date();

    // Calculate fine if overdue (e.g., $1 per day)
    if (transaction.returnDate > transaction.dueDate) {
      const diffTime = Math.abs(transaction.returnDate - transaction.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      transaction.fine = diffDays * 1; 
    }

    await transaction.save();

    // Update book availability
    const book = await Book.findById(transaction.book);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Renew a book
// @route   POST /api/transactions/renew/:id
// @access  Private
const renewBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.status !== 'Active') {
      return res.status(400).json({ message: 'Valid active transaction not found' });
    }

    // Allow members to renew their own, staff can renew any
    if (req.user.role === 'member' && transaction.member.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to renew this book' });
    }

    if (new Date() > transaction.dueDate) {
      return res.status(400).json({ message: 'Cannot renew an overdue book. Please return it and pay the fine.' });
    }

    // Add 14 days to current due date
    const newDueDate = new Date(transaction.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    transaction.dueDate = newDueDate;
    transaction.renewedOn = new Date();
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reserve a book
// @route   POST /api/transactions/reserve
// @access  Private (Members)
const reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const memberId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book || book.available <= 0) {
      return res.status(400).json({ message: 'Book not available for reservation' });
    }

    const existingReservation = await Transaction.findOne({
      book: bookId,
      member: memberId,
      status: { $in: ['Active', 'Reserved'] }
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'You already have this book active or reserved' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3); // Reservation valid for 3 days to pick up

    const transaction = await Transaction.create({
      book: bookId,
      member: memberId,
      dueDate,
      status: 'Reserved'
    });

    book.available -= 1;
    await book.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a reserved book
// @route   POST /api/transactions/approve/:id
// @access  Private/Staff
const approveReservation = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.status !== 'Reserved') {
      return res.status(400).json({ message: 'Valid reserved transaction not found' });
    }

    // Set status to Active and set new due date to 14 days from now
    transaction.status = 'Active';
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    transaction.dueDate = dueDate;
    
    // We update issueDate to reflect when it actually started
    transaction.issueDate = new Date();

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, issueBook, returnBook, renewBook, reserveBook, approveReservation };
