const express = require('express');
const router = express.Router();
const {
  getNews,
  getHeadlines,
  searchNews
} = require('../controllers/newsController');

// Rutele sunt publice (nu necesită autentificare)

// @route   GET /api/news
// @desc    Obține știri financiare filtrate pe categorie
// @access  Public
router.get('/', getNews);

// @route   GET /api/news/headlines
// @desc    Obține top headlines
// @access  Public
router.get('/headlines', getHeadlines);

// @route   GET /api/news/search
// @desc    Caută știri după cuvinte cheie
// @access  Public
router.get('/search', searchNews);

module.exports = router;