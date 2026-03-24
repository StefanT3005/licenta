const express = require('express');
const router = express.Router();

// Importăm middleware-ul de protecție
const { protect } = require('../middleware/authMiddleware');

// Importăm toate funcțiile din controller
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

// Rute Publice (nu necesită token)
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/logout', logout);

// Rute Private (necesită token valid - folosim middleware-ul "protect")
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/resend-verification', protect, resendVerification);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;