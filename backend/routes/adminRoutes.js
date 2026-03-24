/**
 * Admin Routes
 * Rute pentru administrarea sistemului
 * Toate rutele necesită autentificare + permisiuni admin
 */

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); // ← FOLOSEȘTE MIDDLEWARE-UL EXISTENT!
const {
  getAllUsers,
  getSystemStats,
  getUserDetails,
  deleteUser,
  toggleAdminStatus
} = require('../controllers/adminController');

/**
 * GET /api/admin/stats
 * Obține statistici generale sistem
 */
router.get('/stats', protect, admin, getSystemStats);

/**
 * GET /api/admin/users
 * Obține lista tuturor utilizatorilor
 */
router.get('/users', protect, admin, getAllUsers);

/**
 * GET /api/admin/users/:userId
 * Obține detalii despre un utilizator specific
 */
router.get('/users/:userId', protect, admin, getUserDetails);

/**
 * DELETE /api/admin/users/:userId
 * Șterge un utilizator și toate datele asociate
 */
router.delete('/users/:userId', protect, admin, deleteUser);

/**
 * PATCH /api/admin/users/:userId/toggle-admin
 * Schimbă statusul de admin al unui utilizator
 */
router.patch('/users/:userId/toggle-admin', protect, admin, toggleAdminStatus);

module.exports = router;