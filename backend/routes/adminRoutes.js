const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); 
const {
  getAllUsers,
  getSystemStats,
  getUserDetails,
  deleteUser,
  toggleAdminStatus
} = require('../controllers/adminController');

router.get('/stats', protect, admin, getSystemStats);

router.get('/users', protect, admin, getAllUsers);

router.get('/users/:userId', protect, admin, getUserDetails);

router.delete('/users/:userId', protect, admin, deleteUser);

router.patch('/users/:userId/toggle-admin', protect, admin, toggleAdminStatus);

module.exports = router;