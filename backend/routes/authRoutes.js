const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  verifyEmail,    
  resendVerification,    
  deleteAccount
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/resend-verification', protect, resendVerification);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;