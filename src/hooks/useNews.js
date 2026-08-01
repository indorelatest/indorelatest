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
        if (result && result.data && result.data.length > 0) {
          setNews(result.data);
        } else {
          // Fallback to static JSON if database is empty
          const fallbackData = await import('../data/news.json');
          setNews(fallbackData.default || []);
        }
      } catch (err) {
        console.warn('API connection issue, loading fallback static news:', err.message);
        try {
          const fallbackData = await import('../data/news.json');
          setNews(fallbackData.default || []);
        } catch (e) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    loadAllNews();
  }, []);

  // ─── Derived data from loaded news ───────────────────────────────────────────
  const getFeaturedNews = useCallback(() => {
    return news.filter((item) => item.featured);
  }, [news]);

  const getLatestNews = useCallback(
    (limit = 6) => {
      return [...news]
        .sort((a, b) => new Date(b.createdAt || b.publishedAt || Date.now()) - new Date(a.createdAt || a.publishedAt || Date.now()))
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
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, limit);
    },
    [news]
  );

  const getMostReadNews = useCallback(
    (limit = 5) => {
      return [...news].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit);
    },
    [news]
  );

  const searchNews = useCallback(
    async (query, lang = 'hi') => {
      if (!query) return [];
      try {
        const result = await fetchSearchNews(query, lang);
        if (result && result.data && result.data.length > 0) {
          return result.data;
        }
      } catch {
        // Fallback to client-side search
      }

      const lowerQuery = query.toLowerCase();
      return news.filter((item) => {
        const title = item[`title_${lang}`] || item.title_hi || '';
        const summary = item[`summary_${lang}`] || item.summary_hi || '';
        return (
          title.toLowerCase().includes(lowerQuery) ||
          summary.toLowerCase().includes(lowerQuery)
        );
      });
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
