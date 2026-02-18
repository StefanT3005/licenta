const express = require('express');
const router = express.Router();
const {
  getPreferences,
  setPreferences,
  checkPreferences,
  deletePreferences,
  getSuggestions
} = require('../controllers/preferencesController');
const { protect } = require('../middleware/authMiddleware');

// Toate rutele necesită autentificare
router.use(protect);

// @route   GET /api/preferences
// @desc    Obține preferințele utilizatorului
// @access  Private
router.get('/', getPreferences);

// @route   POST /api/preferences
// @desc    Creează sau actualizează preferințele
// @access  Private
router.post('/', setPreferences);

// @route   GET /api/preferences/check
// @desc    Verifică dacă utilizatorul are preferințe setate
// @access  Private
router.get('/check', checkPreferences);

// @route   GET /api/preferences/suggestions
// @desc    Obține sugestii personalizate bazate pe preferințe
// @access  Private
router.get('/suggestions', getSuggestions);

// @route   DELETE /api/preferences
// @desc    Șterge preferințele utilizatorului
// @access  Private
router.delete('/', deletePreferences);

module.exports = router;