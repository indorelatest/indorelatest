import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import ResponsiveImage from '../common/ResponsiveImage';

export default function HeroSection({ featuredNews = [], sideNews = [] }) {
  const { lang, t } = useLanguage();
  const mainArticle = featuredNews[0];
  const rightArticles = sideNews.slice(0, 3);

  if (!mainArticle) return null;

  const mainTitle = mainArticle[`title_${lang}`] || mainArticle.title_hi;
  const mainSummary = mainArticle[`summary_${lang}`] || mainArticle.summary_hi;
  const mainCategory = mainArticle[`category_${lang}`] || mainArticle.category_hi;
  const mainPublishDate = mainArticle[`publishDate_${lang}`] || mainArticle.publishDate_hi;
  const mainImageSrc = mainArticle.imageUrl || mainArticle.image;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Large Featured Story */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 flex flex-col"
        >
          <div className="group relative flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Featured Image with Eager Loading & High Fetch Priority for Core Web Vitals (LCP) */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <ResponsiveImage
                src={mainImageSrc}
                alt={mainArticle.alt || mainTitle}
                width={mainArticle.width || 1200}
                height={mainArticle.height || 675}
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity pointer-events-none" />
              
              {/* Floating Badge */}
              <span className="absolute top-4 left-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded shadow-md tracking-wider pointer-events-none">
                {mainCategory}
              </span>

              {/* Text Content Overlay on Image */}
              <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex flex-col justify-end text-white">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 mb-3">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span>{mainPublishDate}</span>
                </div>

                {/* Big Headline */}
                <h2 className="font-display font-black text-xl md:text-3xl lg:text-4xl leading-tight text-white mb-3 group-hover:text-zinc-100 transition-colors">
                  <Link to={`/article/${mainArticle.id}`} className="focus:outline-none hover:underline">
                    {mainTitle}
                  </Link>
                </h2>

                {/* Summary */}
                <p className="text-sm text-zinc-200 line-clamp-2 md:line-clamp-3 leading-relaxed mb-4 max-w-3xl">
                  {mainSummary}
                </p>

                {/* Button */}
                <div className="mt-2">
                  <Link
                    to={`/article/${mainArticle.id}`}
                    className="inline-flex items-center gap-2 bg-brand-red text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-brand-red-hover active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <span>{t('readMore')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Three Stacked Important News Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
            <h3 className="font-display font-extrabold text-lg uppercase tracking-wide border-l-4 border-brand-red pl-3 text-zinc-900 dark:text-zinc-50">
              {t('topStories')}
            </h3>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {rightArticles.map((article) => {
              const sideTitle = article[`title_${lang}`] || article.title_hi;
              const sideCategory = article[`category_${lang}`] || article.category_hi;
              const sidePublishDate = article[`publishDate_${lang}`] || article.publishDate_hi;
              const sideImg = article.imageUrl || article.image;

              return (
                <div
                  key={article.id}
                  className="group flex gap-4 p-3 bg-white dark:bg-zinc-900 border border-zinc-250/70 dark:border-zinc-800 rounded-xl hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
                >
                  {/* Small Image */}
                  <div className="relative w-24 md:w-28 h-20 md:h-22 rounded-lg overflow-hidden shrink-0 bg-zinc-150 dark:bg-zinc-800">
                    <ResponsiveImage
                      src={sideImg}
                      alt={article.alt || sideTitle}
                      width={article.width || 300}
                      height={article.height || 200}
                      loading="lazy"
                      fetchPriority="low"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">
                        {sideCategory}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-sans">
                        {sidePublishDate}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-zinc-800 dark:text-zinc-100 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                      <Link to={`/article/${article.id}`}>
                        {sideTitle}
                      </Link>
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
