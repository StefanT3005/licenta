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

router.use(protect);

router.get('/', getPreferences);

router.post('/', setPreferences);

router.get('/check', checkPreferences);

router.get('/suggestions', getSuggestions);

router.delete('/', deletePreferences);

module.exports = router;