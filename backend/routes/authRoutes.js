const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // ← SCHIMBĂ ASTA!

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);        // ← folosește protect
router.put('/profile', protect, updateProfile); // ← folosește protect

module.exports = router;