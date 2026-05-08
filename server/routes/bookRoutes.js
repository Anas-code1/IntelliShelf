const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, staffOnly, adminOnly } = require('../middleware/authMiddleware');

const { getRecommendations } = require('../controllers/recommendationController');

router.route('/')
  .get(getBooks)
  .post(protect, staffOnly, createBook);

router.get('/recommendations', protect, getRecommendations);

router.route('/:id')
  .get(getBookById)
  .put(protect, staffOnly, updateBook)
  .delete(protect, adminOnly, deleteBook);

module.exports = router;
