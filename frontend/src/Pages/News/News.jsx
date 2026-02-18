import { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, ExternalLink, Calendar, Search, Filter } from 'lucide-react';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  // NewsAPI Key - Înlocuiește cu cheia ta de la newsapi.org
  const NEWS_API_KEY = 'e1fd5e23dfab486196df1c90f92efc7b';
  const NEWS_API_URL = 'https://newsapi.org/v2';

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Categorii financiare populare
      const queries = {
        general: 'finance OR investing OR stocks OR markets',
        stocks: 'stock market OR S&P 500 OR nasdaq OR dow jones',
        crypto: 'cryptocurrency OR bitcoin OR ethereum OR blockchain',
        economy: 'economy OR GDP OR inflation OR federal reserve'
      };

      const query = queries[category] || queries.general;

      const response = await axios.get(`${NEWS_API_URL}/everything`, {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: NEWS_API_KEY
        }
      });

      // Filtrează articolele care au imagini și descriere
      const filteredNews = response.data.articles.filter(
        article => article.urlToImage && article.description
      );

      setNews(filteredNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback cu știri demo dacă API-ul nu funcționează
      setNews(getDemoNews());
    } finally {
      setLoading(false);
    }
  };

  // Știri demo pentru fallback (când API-ul nu funcționează sau nu ai cheie)
  const getDemoNews = () => [
    {
      title: "S&P 500 Reaches New All-Time High as Tech Stocks Surge",
      description: "The S&P 500 index closed at a record high today, driven by strong performances from major technology companies. Investors remain optimistic about corporate earnings.",
      url: "https://example.com/news/1",
      urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
      publishedAt: new Date().toISOString(),
      source: { name: "Financial Times" }
    },
    {
      title: "Bitcoin Breaks $50,000 as Institutional Interest Grows",
      description: "Bitcoin crossed the $50,000 threshold today, marking a significant milestone. Analysts attribute the rise to increased institutional adoption and ETF approvals.",
      url: "https://example.com/news/2",
      urlToImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: { name: "Bloomberg" }
    },
    {
      title: "Federal Reserve Signals Potential Rate Cuts in 2024",
      description: "The Federal Reserve indicated it may begin cutting interest rates later this year if inflation continues to moderate. Markets rallied on the news.",
      url: "https://example.com/news/3",
      urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: { name: "Reuters" }
    },
    {
      title: "Tech Giants Report Strong Q4 Earnings",
      description: "Major technology companies exceeded earnings expectations in Q4, with cloud computing and AI services driving growth. Shares rallied in after-hours trading.",
      url: "https://example.com/news/4",
      urlToImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      source: { name: "CNBC" }
    },
    {
      title: "Oil Prices Surge on Middle East Tensions",
      description: "Crude oil prices jumped 5% today amid escalating geopolitical tensions in the Middle East. Energy stocks led market gains.",
      url: "https://example.com/news/5",
      urlToImage: "https://images.unsplash.com/photo-1611068813580-c0a2b3ee3195?w=800",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: { name: "Wall Street Journal" }
    },
    {
      title: "Green Energy Investments Hit Record High",
      description: "Global investments in renewable energy reached unprecedented levels in 2024, driven by government incentives and corporate sustainability commitments.",
      url: "https://example.com/news/6",
      urlToImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      source: { name: "Financial Post" }
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Implementează search custom dacă vrei
      console.log('Searching for:', searchQuery);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHrs < 1) return 'Acum câteva minute';
    if (diffHrs < 24) return `Acum ${diffHrs} ${diffHrs === 1 ? 'oră' : 'ore'}`;
    if (diffDays < 7) return `Acum ${diffDays} ${diffDays === 1 ? 'zi' : 'zile'}`;
    
    return date.toLocaleDateString('ro-RO', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const categories = [
    { id: 'general', label: 'Toate', icon: Newspaper },
    { id: 'stocks', label: 'Acțiuni', icon: TrendingUp },
    { id: 'crypto', label: 'Crypto', icon: TrendingUp },
    { id: 'economy', label: 'Economie', icon: TrendingUp }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Știri Financiare 📰
        </h1>
        <p className="text-gray-600">Rămâi la curent cu cele mai importante știri din piață</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Caută știri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              Caută
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition
                  ${category === cat.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* News Grid */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                    {article.source.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(article.publishedAt)}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {article.description}
                </p>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Citește articolul
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && news.length === 0 && (
        <div className="text-center py-20">
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nu am găsit știri</h3>
          <p className="text-gray-600">Încearcă să schimbi categoria sau caută altceva</p>
        </div>
      )}
    </div>
  );
};

export default News;