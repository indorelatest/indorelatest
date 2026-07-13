import React from 'react';
import HeroSection from '../../components/news/HeroSection';
import NewsCard from '../../components/news/NewsCard';
import CategorySection from '../../components/news/CategorySection';
import TrendingSidebar from '../../components/news/TrendingSidebar';
import SkeletonCard from '../../components/ui/SkeletonCard';
import useNews from '../../hooks/useNews';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

export default function Home() {
  const { lang, t } = useLanguage();
  const {
    news,
    loading,
    getFeaturedNews,
    getLatestNews,
    getNewsByCategory,
    getTrendingNews,
    getMostReadNews,
  } = useNews();

  const categories = [
    'इंदौर',
    'मध्यप्रदेश',
    'देश',
    'विदेश',
    'सिंहस्थ',
    'टेक्नोलॉजी',
    'Jobs & Education',
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-12">
        {/* Hero Loading skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-8 aspect-[16/9] bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="lg:col-span-4 space-y-4">
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        </div>

        {/* Latest News grid loading skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="lg:col-span-4 h-[400px] bg-zinc-150 dark:bg-zinc-800/40 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const featured = getFeaturedNews();
  const latest = getLatestNews(6);
  const trending = getTrendingNews(5);
  const mostRead = getMostReadNews(5);

  return (
    <div className="space-y-4 md:space-y-6 pb-12">
      {/* 1. Hero Section */}
      <HeroSection featuredNews={featured} sideNews={latest} />

      {/* 2. Main Content Grid (Latest News & Sidebar) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 border-t border-zinc-200 dark:border-zinc-800 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Latest News Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-6">
              <span className="w-1.5 h-6 bg-brand-red inline-block" />
              <h2 className="font-display font-black text-xl md:text-2xl text-zinc-900 dark:text-zinc-50 tracking-wide uppercase">
                {t('latest')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latest.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <TrendingSidebar
              trendingNews={trending}
              mostReadNews={mostRead}
              latestNews={latest}
            />
          </div>

        </div>
      </section>

      {/* 3. Category Home Sections */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        {categories.map((cat) => {
          const catArticles = getNewsByCategory(cat);
          return (
            <CategorySection
              key={cat}
              categoryName={cat}
              articles={catArticles}
            />
          );
        })}
      </section>
      
    </div>
  );
}
