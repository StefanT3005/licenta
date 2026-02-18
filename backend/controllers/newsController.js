const axios = require('axios');

/**
 * News Controller
 * Integrare cu NewsAPI pentru știri financiare
 * API Key: Trebuie adăugat în .env ca NEWS_API_KEY
 */

// @desc    Get financial news
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
  try {
    const { category = 'business', page = 1, pageSize = 10 } = req.query;
    
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY) {
      return res.status(500).json({ 
        message: 'News API key not configured',
        articles: [] 
      });
    }
    
    // Mapare categorii la query-uri relevante
    const categoryQueries = {
      business: 'financial OR investing OR economy',
      crypto: 'cryptocurrency OR bitcoin OR blockchain',
      stocks: 'stock market OR shares OR trading',
      etf: 'ETF OR index fund',
      general: 'finance OR investment'
    };
    
    const query = categoryQueries[category] || categoryQueries.general;
    
    // Apel la NewsAPI
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        page: page,
        pageSize: pageSize,
        apiKey: NEWS_API_KEY
      }
    });
    
    // Formatare răspuns
    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source.name,
      author: article.author,
      category: category
    }));
    
    res.json({
      success: true,
      totalResults: response.data.totalResults,
      articles: articles,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error('Get news error:', error.response?.data || error.message);
    
    // Fallback - returnează array gol în caz de eroare
    res.json({
      success: false,
      message: error.response?.data?.message || 'Error fetching news',
      articles: [],
      totalResults: 0
    });
  }
};

// @desc    Get top headlines
// @route   GET /api/news/headlines
// @access  Public
exports.getHeadlines = async (req, res) => {
  try {
    const { country = 'us', category = 'business' } = req.query;
    
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY) {
      return res.status(500).json({ 
        message: 'News API key not configured',
        articles: [] 
      });
    }
    
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: country,
        category: category,
        apiKey: NEWS_API_KEY
      }
    });
    
    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source.name,
      author: article.author
    }));
    
    res.json({
      success: true,
      totalResults: response.data.totalResults,
      articles: articles
    });
  } catch (error) {
    console.error('Get headlines error:', error.response?.data || error.message);
    
    res.json({
      success: false,
      message: error.response?.data?.message || 'Error fetching headlines',
      articles: [],
      totalResults: 0
    });
  }
};

// @desc    Search news by keyword
// @route   GET /api/news/search
// @access  Public
exports.searchNews = async (req, res) => {
  try {
    const { q, page = 1, pageSize = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY) {
      return res.status(500).json({ 
        message: 'News API key not configured',
        articles: [] 
      });
    }
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: q,
        language: 'en',
        sortBy: 'publishedAt',
        page: page,
        pageSize: pageSize,
        apiKey: NEWS_API_KEY
      }
    });
    
    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source.name,
      author: article.author
    }));
    
    res.json({
      success: true,
      query: q,
      totalResults: response.data.totalResults,
      articles: articles,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error('Search news error:', error.response?.data || error.message);
    
    res.json({
      success: false,
      message: error.response?.data?.message || 'Error searching news',
      articles: [],
      totalResults: 0
    });
  }
};