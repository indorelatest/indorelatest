import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useNews from '../../hooks/useNews';
import NewsCard from '../../components/news/NewsCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { useLanguage } from '../../context/LanguageContext';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Category({ categoryName: propCategoryName }) {
  const { categoryName: urlCategoryName } = useParams();
  const categoryName = propCategoryName || urlCategoryName;
  const { getNewsByCategory, loading } = useNews();
  const { lang, t } = useLanguage();
  
  const [filter, setFilter] = useState('latest'); // latest, popular, oldest
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryName]);

  // Category name dictionary
  const categoryTranslations = {
    'इंदौर': { hi: 'इंदौर', en: 'Indore' },
    'मध्यप्रदेश': { hi: 'मध्यप्रदेश', en: 'Madhya Pradesh' },
    'देश': { hi: 'देश', en: 'India' },
    'विदेश': { hi: 'विदेश', en: 'World' },
    'सिंहस्थ': { hi: 'सिंहस्थ', en: 'Simhastha' },
    'टेक्नोलॉजी': { hi: 'टेक्नोलॉजी', en: 'Technology' },
    'नौकरी और शिक्षा': { hi: 'नौकरी और शिक्षा', en: 'Jobs & Education' },
    'indore': { hi: 'इंदौर', en: 'Indore' },
    'madhya pradesh': { hi: 'मध्यप्रदेश', en: 'Madhya Pradesh' },
    'india': { hi: 'देश', en: 'India' },
    'world': { hi: 'विदेश', en: 'World' },
    'simhastha': { hi: 'सिंहस्थ', en: 'Simhastha' },
    'technology': { hi: 'टेक्नोलॉजी', en: 'Technology' },
    'jobs & education': { hi: 'नौकरी और शिक्षा', en: 'Jobs & Education' }
  };

  // Safe lower-case mapping for lookups
  const normKey = categoryName?.toLowerCase() || '';
  const resolvedCategory = categoryTranslations[normKey];
  const displayName = resolvedCategory?.[lang] || categoryName;
  const canonicalCategoryName = resolvedCategory?.hi || categoryName; // use Hindi key for data filtering in useNews

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Get articles of category (matches either Hindi or English path names)
  const articles = getNewsByCategory(canonicalCategoryName) || [];

  // Apply filters / sorting
  const sortedArticles = [...articles].sort((a, b) => {
    if (filter === 'popular') {
      return b.views - a.views;
    }
    if (filter === 'oldest') {
      return a.id.localeCompare(b.id);
    }
    // Default: 'latest'
    return b.id.localeCompare(a.id);
  });

  // Pagination calculation
  const totalItems = sortedArticles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedArticles.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8 pb-16 font-sans">
      
      {/* 1. Category Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-950 dark:to-zinc-900 text-white rounded-2xl p-6 md:p-10 overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col justify-center">
          <span className="text-xs font-bold bg-brand-red text-white px-2.5 py-1 rounded self-start uppercase tracking-widest mb-3">
            {t('categoryArchive')}
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl text-white leading-none mb-2">
            {displayName}
          </h1>
          <p className="text-sm md:text-base text-zinc-350 max-w-xl leading-relaxed">
            {lang === 'en'
              ? `Latest updates, headlines, ground coverage and articles matching category: ${displayName}.`
              : `${displayName} से जुड़ी ताज़ा ख़बरें, विश्लेषण, साक्षात्कार और विशेष रिपोर्ट।`}
          </p>
        </div>
      </motion.div>

      {/* 2. Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <SlidersHorizontal className="w-4.5 h-4.5 text-brand-red" />
          <span className="text-sm font-bold">{t('filter')}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => { setFilter('latest'); setCurrentPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              filter === 'latest'
                ? 'bg-brand-red text-white'
                : 'bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100'
            }`}
          >
            {t('latestFilter')}
          </button>
          <button
            onClick={() => { setFilter('popular'); setCurrentPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              filter === 'popular'
                ? 'bg-brand-red text-white'
                : 'bg-white dark:bg-zinc-900 border border-zinc-255 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100'
            }`}
          >
            {t('popularFilter')}
          </button>
          <button
            onClick={() => { setFilter('oldest'); setCurrentPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              filter === 'oldest'
                ? 'bg-brand-red text-white'
                : 'bg-white dark:bg-zinc-900 border border-zinc-255 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100'
            }`}
          >
            {t('oldestFilter')}
          </button>
        </div>
      </div>

      {/* 3. News Grid */}
      {currentItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-500">
          <p className="text-lg font-bold">
            {lang === 'en'
              ? 'No news articles available in this category.'
              : 'इस श्रेणी में कोई ख़बरें उपलब्ध नहीं हैं।'}
          </p>
          <Link to="/" className="text-brand-red hover:underline mt-2 inline-block">
            {t('backToHome')}
          </Link>
        </div>
      )}

      {/* 4. Pagination UI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('prev')}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-brand-red text-white'
                    : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <span>{t('next')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
