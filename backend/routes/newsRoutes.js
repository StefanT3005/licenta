const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/all', async (req, res) => {
    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'stocks OR investing OR markets OR ETF OR crypto OR economy OR finance',
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 100,
                domains: 'cnbc.com', 
                apiKey: process.env.NEWS_API_KEY
            }
        });

        const articles = response.data.articles
            .filter(a => a.title && a.url && a.title !== '[Removed]') 
            .slice(0, 60)
            .map(a => ({
                title: a.title,
                description: a.description || '',
                url: a.url,
                publishedAt: a.publishedAt,
                source: 'CNBC', 
                urlToImage: a.urlToImage || null
            }));

        res.status(200).json({ totalResults: articles.length, articles });
    } catch (error) {
        console.error("Eroare la preluarea stirilor:", error.message);
        res.status(500).json({ message: 'Eroare la preluarea stirilor', articles: [] });
    }
});

module.exports = router;