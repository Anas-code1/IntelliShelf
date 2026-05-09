const express = require('express');
const router = express.Router();
const { getTransactions, issueBook, returnBook, renewBook, reserveBook, approveReservation } = require('../controllers/transactionController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTransactions);

router.post('/issue', protect, staffOnly, issueBook);
router.post('/return/:id', protect, staffOnly, returnBook);
router.post('/renew/:id', protect, renewBook);
router.post('/reserve', protect, reserveBook);
router.post('/approve/:id', protect, staffOnly, approveReservation);

module.exports = router;
