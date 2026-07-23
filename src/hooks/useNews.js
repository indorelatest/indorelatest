import { useState, useEffect, useCallback } from 'react';
import {
  fetchAllNews,
  fetchFeaturedNews,
  fetchBreakingNews,
  fetchSearchNews,
  fetchNewsByCategory,
  fetchNewsById as apiFetchNewsById,
  fetchTrendingNews,
  fetchMostReadNews,
  fetchLatestNews,
  postIncrementView,
} from '../services/newsService';

export default function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllNews = async () => {
      try {
        setLoading(true);
        const result = await fetchAllNews();
        setNews(result.data || []);
      } catch (err) {
        console.error('Failed to load news:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAllNews();
  }, []);

  // ─── Derived data from loaded news (client-side, for components that pass data down) ───
  const getFeaturedNews = useCallback(() => {
    return news.filter((item) => item.featured);
  }, [news]);

  const getLatestNews = useCallback(
    (limit = 6) => {
      return [...news]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    },
    [news]
  );

  const getNewsByCategory = useCallback(
    (category) => {
      return news.filter(
        (item) =>
          item.category_hi?.toLowerCase() === category.toLowerCase() ||
          item.category_en?.toLowerCase() === category.toLowerCase()
      );
    },
    [news]
  );

  const getNewsById = useCallback(
    (id) => {
      return news.find((item) => item.id === id);
    },
    [news]
  );

  const getTrendingNews = useCallback(
    (limit = 5) => {
      return [...news]
        .filter((item) => item.trending)
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    },
    [news]
  );

  const getMostReadNews = useCallback(
    (limit = 5) => {
      return [...news].sort((a, b) => b.views - a.views).slice(0, limit);
    },
    [news]
  );

  const searchNews = useCallback(
    async (query, lang = 'hi') => {
      if (!query) return [];
      try {
        const result = await fetchSearchNews(query, lang);
        return result.data || [];
      } catch {
        // Fallback to client-side search
        const lowerQuery = query.toLowerCase();
        return news.filter((item) => {
          const title = item[`title_${lang}`] || '';
          const summary = item[`summary_${lang}`] || '';
          return (
            title.toLowerCase().includes(lowerQuery) ||
            summary.toLowerCase().includes(lowerQuery)
          );
        });
      }
    },
    [news]
  );

  const getRelatedNews = useCallback(
    (currentNewsId, category, limit = 3) => {
      return news
        .filter(
          (item) =>
            (item.category_hi === category || item.category_en === category) &&
            item.id !== currentNewsId
        )
        .slice(0, limit);
    },
    [news]
  );

  const incrementView = useCallback(async (id) => {
    try {
      await postIncrementView(id);
    } catch {
      // silently fail — don't disrupt reading experience
    }
  }, []);

  return {
    news,
    loading,
    error,
    getFeaturedNews,
    getLatestNews,
    getNewsByCategory,
    getNewsById,
    getTrendingNews,
    getMostReadNews,
    searchNews,
    getRelatedNews,
    incrementView,
  };
}
