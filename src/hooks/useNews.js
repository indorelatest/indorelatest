import { useState, useEffect } from 'react';
import newsData from '../data/news.json';

export default function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock network latency to showcase skeleton loading state
    const timer = setTimeout(() => {
      setNews(newsData);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const getFeaturedNews = () => {
    return news.filter(item => item.featured);
  };

  const getLatestNews = (limit = 6) => {
    return [...news]
      .sort((a, b) => {
        return b.id.localeCompare(a.id);
      })
      .slice(0, limit);
  };

  const getNewsByCategory = (category) => {
    // Matches category name in either Hindi or English for seamless routing
    return news.filter(
      item =>
        item.category_hi.toLowerCase() === category.toLowerCase() ||
        item.category_en.toLowerCase() === category.toLowerCase()
    );
  };

  const getNewsById = (id) => {
    return news.find(item => item.id === id);
  };

  const getTrendingNews = (limit = 5) => {
    return [...news]
      .filter(item => item.trending)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  };

  const getMostReadNews = (limit = 5) => {
    return [...news]
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  };

  const searchNews = (query, lang = 'hi') => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return news.filter(item => {
      const title = item[`title_${lang}`] || '';
      const summary = item[`summary_${lang}`] || '';
      const content = item[`content_${lang}`] || '';
      return (
        title.toLowerCase().includes(lowerQuery) ||
        summary.toLowerCase().includes(lowerQuery) ||
        content.toLowerCase().includes(lowerQuery)
      );
    });
  };

  const getRelatedNews = (currentNewsId, category, limit = 3) => {
    return news
      .filter(
        item =>
          (item.category_hi === category || item.category_en === category) &&
          item.id !== currentNewsId
      )
      .slice(0, limit);
  };

  return {
    news,
    loading,
    getFeaturedNews,
    getLatestNews,
    getNewsByCategory,
    getNewsById,
    getTrendingNews,
    getMostReadNews,
    searchNews,
    getRelatedNews
  };
}
