import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';

const ARTICLES_PER_PAGE = 9;

const News = () => {
    const [allNews, setAllNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        applyFilters();
        setCurrentPage(1);
    }, [allNews]); // Am păstrat doar allNews aici ca dependență

    const fetchNews = async () => {
        try {
            const { data } = await api.get('/news/all');
            setAllNews(data.articles || []);
            setFilteredNews(data.articles || []);
        } catch (error) {
            setAllNews([]);
            setFilteredNews([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (query = searchQuery) => {
        let filtered = allNews;

        if (query.trim()) {
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(query.toLowerCase()) ||
                (a.description || '').toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredNews(filtered);
        setCurrentPage(1);
    };

    const handleSearch = () => applyFilters();

    const handleReset = () => {
        setSearchQuery('');
        setFilteredNews(allNews);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const diffHrs = Math.floor((Date.now() - date) / 3600000);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffHrs < 1) return 'Acum cateva minute';
        if (diffHrs < 24) return `Acum ${diffHrs}h`;
        if (diffDays < 7) return `Acum ${diffDays}z`;
        return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
    };

    const totalPages = Math.ceil(filteredNews.length / ARTICLES_PER_PAGE);
    const paginatedNews = filteredNews.slice(
        (currentPage - 1) * ARTICLES_PER_PAGE,
        currentPage * ARTICLES_PER_PAGE
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Știri Financiare</h1>
                <p className="text-gray-500 text-sm">De actualitate, la nivel global.</p>
            </div>

            {/* search */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cauta stiri..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
                    >
                        Cauta
                    </button>
                    {searchQuery && (
                        <button
                            onClick={handleReset}
                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {searchQuery && (
                    <p className="text-xs text-gray-500">
                        {filteredNews.length} {filteredNews.length === 1 ? 'rezultat' : 'rezultate'}
                    </p>
                )}
            </div>

            {/* grid stiri */}
            {paginatedNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedNews.map((article, index) => (
                        <article
                            key={index}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                        >
                            {/* imagine */}
                            <div className="relative h-44 bg-gray-100 overflow-hidden flex-shrink-0">
                                {article.urlToImage ? (
                                    <img
                                        src={article.urlToImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Newspaper className="w-10 h-10 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* content */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(article.publishedAt)}
                                </div>

                                <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </h3>

                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                                    {article.description}
                                </p>

                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition mt-auto"
                                >
                                    Citeste articolul
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Nu am gasit stiri</h3>
                    <p className="text-sm text-gray-500 mb-4">Incearca o alta cautare</p>
                    <button
                        onClick={handleReset}
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                        Arata toate Știrile
                    </button>
                </div>
            )}

            {/* paginare */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Inapoi
                    </button>

                    <span className="text-sm text-gray-500">
                        {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Inainte
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default News;