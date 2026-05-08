const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const { protect, adminOnly, staffOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, staffOnly, getUsers);

router.route('/:id')
  .delete(protect, adminOnly, deleteUser)
  .put(protect, adminOnly, updateUserRole);

module.exports = router;
